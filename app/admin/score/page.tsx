"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, AlertTriangle, Loader2 } from "lucide-react";

// Types
interface ScoringMatrixRow {
  id: string;
  factor: string;
  factor_slug: string;
  max_points: number;
  weight: number;
  type: "range" | "enum";
  condition: string;
  condition_slug: string;
  range_min: number | null;
  range_max: number | null;
  enum_value: string | null;
  score: number;
  created_at: string;
}

interface FactorGroup {
  factor: string;
  factor_slug: string;
  max_points: number;
  weight: number;
  rows: ScoringMatrixRow[];
}

// API functions
async function fetchScoringMatrix(): Promise<ScoringMatrixRow[]> {
  const res = await fetch("/api/scoring", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

async function createScoringRow(
  payload: Omit<ScoringMatrixRow, "id" | "created_at">,
): Promise<ScoringMatrixRow> {
  const res = await fetch("/api/scoring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

async function updateScoringRow(
  id: string,
  payload: Partial<ScoringMatrixRow>,
): Promise<ScoringMatrixRow> {
  const res = await fetch("/api/scoring", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, payload }),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

async function deleteScoringRow(id: string): Promise<void> {
  const res = await fetch("/api/scoring", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete");
}

// Helper to group rows by factor_slug
function groupByFactor(rows: ScoringMatrixRow[]): FactorGroup[] {
  const groups: Record<string, FactorGroup> = {};
  for (const row of rows) {
    if (!groups[row.factor_slug]) {
      groups[row.factor_slug] = {
        factor: row.factor,
        factor_slug: row.factor_slug,
        max_points: row.max_points,
        weight: row.weight,
        rows: [],
      };
    }
    groups[row.factor_slug].rows.push(row);
  }
  return Object.values(groups);
}

// Helper to sanitize slug
function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function ScoringAdminPage() {
  const [rows, setRows] = useState<ScoringMatrixRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    condition?: string;
    type?: "range" | "enum";
    range_min?: string | number | null;
    range_max?: string | number | null;
    enum_value?: string;
    score?: number;
  }>({});

  // Modals
  const [isAddFactorModalOpen, setIsAddFactorModalOpen] = useState(false);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState<ScoringMatrixRow | null>(null);

  // Forms
  const [factorForm, setFactorForm] = useState({
    factor: "",
    factor_slug: "",
    max_points: 0,
    weight: 0,
    type: "range" as "range" | "enum",
    condition: "",
    range_min: "",
    range_max: "",
    enum_value: "",
    score: 0,
  });

  const [ruleForm, setRuleForm] = useState({
    factor_slug: "",
    type: "range" as "range" | "enum",
    condition: "",
    range_min: "",
    range_max: "",
    enum_value: "",
    score: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchScoringMatrix();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const groups = groupByFactor(rows);
  const uniqueFactors = [...new Set(rows.map((r) => r.factor_slug))];

  // Validation
  const totalWeight = groups.reduce((sum, g) => sum + g.weight, 0);
  const weightWarning = Math.abs(totalWeight - 100) > 0.01;
  const factorsWithNoRules = groups.filter((g) => g.rows.length === 0);

  // Handlers
  const handleFactorChange = (field: string, value: string | number) => {
    setFactorForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "factor" && !prev.factor_slug) {
        updated.factor_slug = sanitizeSlug(prev.factor);
      }
      return updated;
    });
  };

  const handleAddFactorSubmit = async () => {
    try {
      const condition_slug = `${sanitizeSlug(factorForm.factor)}_${sanitizeSlug(
        factorForm.condition,
      )}`;
      await createScoringRow({
        factor: factorForm.factor,
        factor_slug: sanitizeSlug(factorForm.factor),
        max_points: factorForm.max_points,
        weight: factorForm.weight,
        type: factorForm.type,
        condition: factorForm.condition,
        condition_slug,
        range_min:
          factorForm.type === "range" ? Number(factorForm.range_min) : null,
        range_max:
          factorForm.type === "range" ? Number(factorForm.range_max) : null,
        enum_value: factorForm.type === "enum" ? factorForm.enum_value : null,
        score: factorForm.score,
      });
      setIsAddFactorModalOpen(false);
      setFactorForm({
        factor: "",
        factor_slug: "",
        max_points: 0,
        weight: 0,
        type: "range",
        condition: "",
        range_min: "",
        range_max: "",
        enum_value: "",
        score: 0,
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    }
  };

  const handleAddRuleSubmit = async () => {
    try {
      const group = groups.find((g) => g.factor_slug === ruleForm.factor_slug);
      if (!group) return;

      const condition_slug = `${ruleForm.factor_slug}_${sanitizeSlug(
        ruleForm.condition,
      )}`;
      await createScoringRow({
        factor: group.factor,
        factor_slug: ruleForm.factor_slug,
        max_points: group.max_points,
        weight: group.weight,
        type: ruleForm.type,
        condition: ruleForm.condition,
        condition_slug,
        range_min:
          ruleForm.type === "range" ? Number(ruleForm.range_min) : null,
        range_max:
          ruleForm.type === "range" ? Number(ruleForm.range_max) : null,
        enum_value: ruleForm.type === "enum" ? ruleForm.enum_value : null,
        score: ruleForm.score,
      });
      setIsAddRuleModalOpen(false);
      setRuleForm({
        factor_slug: "",
        type: "range",
        condition: "",
        range_min: "",
        range_max: "",
        enum_value: "",
        score: 0,
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rule");
    }
  };

  const handleEditStart = (row: ScoringMatrixRow) => {
    setEditingId(row.id);
    setEditForm({
      condition: row.condition,
      type: row.type,
      range_min: row.range_min ?? null,
      range_max: row.range_max ?? null,
      enum_value: row.enum_value ?? "",
      score: row.score,
    });
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    try {
      const condition_slug = `${rows.find((r) => r.id === editingId)?.factor_slug}_${sanitizeSlug(
        editForm.condition || "",
      )}`;
      await updateScoringRow(editingId, {
        ...editForm,
        condition_slug,
        range_min:
          editForm.type === "range" ? Number(editForm.range_min) : null,
        range_max:
          editForm.type === "range" ? Number(editForm.range_max) : null,
        enum_value: editForm.type === "enum" ? editForm.enum_value : null,
      });
      setEditingId(null);
      setEditForm({});
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDeleteClick = (row: ScoringMatrixRow) => {
    setDeletingRow(row);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRow) return;
    try {
      await deleteScoringRow(deletingRow.id);
      setIsDeleteModalOpen(false);
      setDeletingRow(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const isLastRuleOfFactor = (row: ScoringMatrixRow) => {
    const group = groups.find((g) => g.factor_slug === row.factor_slug);
    return group && group.rows.length === 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 max-w-7xl mx-auto">
      {/* Validation Panel */}
      {(weightWarning || factorsWithNoRules.length > 0) && (
        <div className="mb-6 space-y-3">
          {weightWarning && (
            <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Weight Warning</p>
                <p className="text-sm text-amber-700">
                  Total weight is {totalWeight.toFixed(2)}%, expected 100%
                </p>
              </div>
            </div>
          )}
          {factorsWithNoRules.length > 0 && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  Factors Without Rules
                </p>
                <p className="text-sm text-red-700">
                  {factorsWithNoRules.map((g) => g.factor).join(", ")} have no
                  rules
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => setIsAddFactorModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Factor Group
        </Button>
        <div className="flex items-center gap-2">
          <Select
            value={ruleForm.factor_slug}
            onValueChange={(v) =>
              setRuleForm((p) => ({ ...p, factor_slug: v }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select factor" />
            </SelectTrigger>
            <SelectContent>
              {uniqueFactors.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setIsAddRuleModalOpen(true)}
            disabled={!ruleForm.factor_slug}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule to Factor
          </Button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Groups */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div
            key={group.factor_slug}
            className="border rounded-lg overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.factor}
                </h3>
                <p className="text-sm text-gray-500">{group.factor_slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Max Points: {group.max_points}</Badge>
                <Badge>Weight: {group.weight}%</Badge>
              </div>
            </div>

            {/* Rules Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead className="text-right">Max</TableHead>
                  <TableHead>Enum Value</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.rows.map((row) => (
                  <TableRow key={row.id}>
                    {editingId === row.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editForm.condition || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                condition: e.target.value,
                              }))
                            }
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editForm.type || "range"}
                            onValueChange={(v) =>
                              setEditForm((p) => ({
                                ...p,
                                type: v as "range" | "enum",
                              }))
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="range">range</SelectItem>
                              <SelectItem value="enum">enum</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {editForm.type === "range" ? (
                            <Input
                              type="number"
                              value={editForm.range_min ?? ""}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  range_min: e.target.value,
                                }))
                              }
                              className="w-20"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {editForm.type === "range" ? (
                            <Input
                              type="number"
                              value={editForm.range_max ?? ""}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  range_max: e.target.value,
                                }))
                              }
                              className="w-20"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {editForm.type === "enum" ? (
                            <Input
                              value={editForm.enum_value || ""}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  enum_value: e.target.value,
                                }))
                              }
                              className="w-32"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editForm.score ?? 0}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                score: Number(e.target.value),
                              }))
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" onClick={handleEditSave}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">
                          {row.condition}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {row.range_min ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.range_max ?? "-"}
                        </TableCell>
                        <TableCell>{row.enum_value ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          {row.score}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(row)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(row)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No scoring rules found. Click "Add Factor Group" to create one.
          </div>
        )}
      </div>

      {/* Add Factor Group Modal */}
      <Modal
        isOpen={isAddFactorModalOpen}
        onClose={() => setIsAddFactorModalOpen(false)}
        title="Add Factor Group"
      >
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Factor Name
              </label>
              <Input
                value={factorForm.factor}
                onChange={(e) => handleFactorChange("factor", e.target.value)}
                placeholder="e.g., Age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Factor Slug
              </label>
              <Input
                value={factorForm.factor_slug}
                onChange={(e) =>
                  handleFactorChange("factor_slug", e.target.value)
                }
                placeholder="e.g., age"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Points
              </label>
              <Input
                type="number"
                value={factorForm.max_points}
                onChange={(e) =>
                  handleFactorChange("max_points", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (%)
              </label>
              <Input
                type="number"
                step="0.01"
                value={factorForm.weight}
                onChange={(e) =>
                  handleFactorChange("weight", Number(e.target.value))
                }
              />
            </div>
          </div>
          <hr />
          <p className="font-medium text-sm">First Rule</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Condition
              </label>
              <Input
                value={factorForm.condition}
                onChange={(e) =>
                  handleFactorChange("condition", e.target.value)
                }
                placeholder="e.g., 18-29"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={factorForm.type}
                onValueChange={(v) => handleFactorChange("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">range</SelectItem>
                  <SelectItem value="enum">enum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {factorForm.type === "range" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Range Min
                </label>
                <Input
                  type="number"
                  value={factorForm.range_min}
                  onChange={(e) =>
                    handleFactorChange("range_min", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Range Max
                </label>
                <Input
                  type="number"
                  value={factorForm.range_max}
                  onChange={(e) =>
                    handleFactorChange("range_max", e.target.value)
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Enum Value
              </label>
              <Input
                value={factorForm.enum_value}
                onChange={(e) =>
                  handleFactorChange("enum_value", e.target.value)
                }
                placeholder="e.g., married"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Score</label>
            <Input
              type="number"
              value={factorForm.score}
              onChange={(e) =>
                handleFactorChange("score", Number(e.target.value))
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddFactorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFactorSubmit}>Add Factor</Button>
          </div>
        </div>
      </Modal>

      {/* Add Rule Modal */}
      <Modal
        isOpen={isAddRuleModalOpen}
        onClose={() => setIsAddRuleModalOpen(false)}
        title="Add Rule to Factor"
      >
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Condition
              </label>
              <Input
                value={ruleForm.condition}
                onChange={(e) =>
                  setRuleForm((p) => ({ ...p, condition: e.target.value }))
                }
                placeholder="e.g., 30-39"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={ruleForm.type}
                onValueChange={(v) =>
                  setRuleForm((p) => ({ ...p, type: v as "range" | "enum" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">range</SelectItem>
                  <SelectItem value="enum">enum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {ruleForm.type === "range" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Range Min
                </label>
                <Input
                  type="number"
                  value={ruleForm.range_min}
                  onChange={(e) =>
                    setRuleForm((p) => ({ ...p, range_min: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Range Max
                </label>
                <Input
                  type="number"
                  value={ruleForm.range_max}
                  onChange={(e) =>
                    setRuleForm((p) => ({ ...p, range_max: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Enum Value
              </label>
              <Input
                value={ruleForm.enum_value}
                onChange={(e) =>
                  setRuleForm((p) => ({ ...p, enum_value: e.target.value }))
                }
                placeholder="e.g., single"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Score</label>
            <Input
              type="number"
              value={ruleForm.score}
              onChange={(e) =>
                setRuleForm((p) => ({ ...p, score: Number(e.target.value) }))
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddRuleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRuleSubmit}>Add Rule</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Rule"
      >
        <div className="p-6">
          {deletingRow && isLastRuleOfFactor(deletingRow) ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Warning</p>
                  <p className="text-sm text-amber-700">
                    This is the last rule for factor "{deletingRow.factor}".
                    Deleting it will remove the entire factor group.
                  </p>
                </div>
              </div>
              <p>Are you sure you want to delete this rule?</p>
            </div>
          ) : (
            <p>Are you sure you want to delete this rule?</p>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
