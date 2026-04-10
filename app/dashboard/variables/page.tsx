"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RiskCapacityAssessment {
  id: number;
  // Inputs
  age: number;
  family_status: string;
  has_kids: boolean;
  housing_status: string;
  monthly_income_eur: number;
  monthly_expenditures_eur: number;
  income_stability: string;
  additional_yearly_income_eur: number;
  additional_yearly_expenditures_eur: number;
  current_savings_eur: number;
  current_liabilities_eur: number;
  risk_comfort: string;

  // Derived Metrics
  monthly_surplus_eur: number;
  expense_ratio: number;
  net_additional_cash_flow_eur: number;
  savings_coverage_months: number;
  liabilities_to_annual_income: number;

  // Scoring
  score_age: number;
  score_family_status: number;
  score_kids: number;
  score_housing: number;
  score_monthly_income: number;
  score_expense_ratio: number;
  score_income_stability: number;
  score_net_additional_cash_flow: number;
  score_savings_coverage: number;
  score_liabilities_load: number;
  score_risk_comfort: number;
  total_score: number;

  // Result
  capacity_band: string;

  created_at: string;
  updated_at: string;
}

const VariablesPage = () => {
  const [data, setData] = useState<RiskCapacityAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RiskCapacityAssessment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: fetchedData, error } = await supabase
        .from('risk_capacity_assessments')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setData(fetchedData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (item: RiskCapacityAssessment) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('risk_capacity_assessments')
        .update({
          // Inputs
          age: selectedItem.age,
          family_status: selectedItem.family_status,
          has_kids: selectedItem.has_kids,
          housing_status: selectedItem.housing_status,
          monthly_income_eur: selectedItem.monthly_income_eur,
          monthly_expenditures_eur: selectedItem.monthly_expenditures_eur,
          income_stability: selectedItem.income_stability,
          additional_yearly_income_eur: selectedItem.additional_yearly_income_eur,
          additional_yearly_expenditures_eur: selectedItem.additional_yearly_expenditures_eur,
          current_savings_eur: selectedItem.current_savings_eur,
          current_liabilities_eur: selectedItem.current_liabilities_eur,
          risk_comfort: selectedItem.risk_comfort,

          // Derived Metrics
          monthly_surplus_eur: selectedItem.monthly_surplus_eur,
          expense_ratio: selectedItem.expense_ratio,
          net_additional_cash_flow_eur: selectedItem.net_additional_cash_flow_eur,
          savings_coverage_months: selectedItem.savings_coverage_months,
          liabilities_to_annual_income: selectedItem.liabilities_to_annual_income,

          // Scoring
          score_age: selectedItem.score_age,
          score_family_status: selectedItem.score_family_status,
          score_kids: selectedItem.score_kids,
          score_housing: selectedItem.score_housing,
          score_monthly_income: selectedItem.score_monthly_income,
          score_expense_ratio: selectedItem.score_expense_ratio,
          score_income_stability: selectedItem.score_income_stability,
          score_net_additional_cash_flow: selectedItem.score_net_additional_cash_flow,
          score_savings_coverage: selectedItem.score_savings_coverage,
          score_liabilities_load: selectedItem.score_liabilities_load,
          score_risk_comfort: selectedItem.score_risk_comfort,
          total_score: selectedItem.total_score,

          // Result
          capacity_band: selectedItem.capacity_band,
        })
        .eq('id', selectedItem.id);

      if (error) {
        console.error("Error updating data:", error);
        return;
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field: keyof RiskCapacityAssessment, value: any) => {
    if (selectedItem) {
      setSelectedItem({ ...selectedItem, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Risk Capacity Assessments</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Family Status</TableHead>
              <TableHead>Monthly Income</TableHead>
              <TableHead>Monthly Expenses</TableHead>
              <TableHead>Risk Comfort</TableHead>
              <TableHead>Total Score</TableHead>
              <TableHead>Capacity Band</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.family_status}</TableCell>
                <TableCell>€{item.monthly_income_eur.toLocaleString()}</TableCell>
                <TableCell>€{item.monthly_expenditures_eur.toLocaleString()}</TableCell>
                <TableCell>{item.risk_comfort}</TableCell>
                <TableCell>{item.total_score}</TableCell>
                <TableCell>{item.capacity_band}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleUpdate(item)}
                    size="sm"
                    variant="outline"
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Risk Capacity Assessment"
      >
        {selectedItem && (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Input Parameters Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Input Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={selectedItem.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="family_status">Family Status</Label>
                  <Input
                    id="family_status"
                    value={selectedItem.family_status}
                    onChange={(e) => handleInputChange('family_status', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="has_kids">Has Kids</Label>
                  <select
                    id="has_kids"
                    value={selectedItem.has_kids.toString()}
                    onChange={(e) => handleInputChange('has_kids', e.target.value === 'true')}
                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="housing_status">Housing Status</Label>
                  <Input
                    id="housing_status"
                    value={selectedItem.housing_status}
                    onChange={(e) => handleInputChange('housing_status', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthly_income_eur">Monthly Income (€)</Label>
                  <Input
                    id="monthly_income_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.monthly_income_eur}
                    onChange={(e) => handleInputChange('monthly_income_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthly_expenditures_eur">Monthly Expenditures (€)</Label>
                  <Input
                    id="monthly_expenditures_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.monthly_expenditures_eur}
                    onChange={(e) => handleInputChange('monthly_expenditures_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="income_stability">Income Stability</Label>
                  <Input
                    id="income_stability"
                    value={selectedItem.income_stability}
                    onChange={(e) => handleInputChange('income_stability', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_yearly_income_eur">Additional Yearly Income (€)</Label>
                  <Input
                    id="additional_yearly_income_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.additional_yearly_income_eur}
                    onChange={(e) => handleInputChange('additional_yearly_income_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_yearly_expenditures_eur">Additional Yearly Expenditures (€)</Label>
                  <Input
                    id="additional_yearly_expenditures_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.additional_yearly_expenditures_eur}
                    onChange={(e) => handleInputChange('additional_yearly_expenditures_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="current_savings_eur">Current Savings (€)</Label>
                  <Input
                    id="current_savings_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.current_savings_eur}
                    onChange={(e) => handleInputChange('current_savings_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="current_liabilities_eur">Current Liabilities (€)</Label>
                  <Input
                    id="current_liabilities_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.current_liabilities_eur}
                    onChange={(e) => handleInputChange('current_liabilities_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="risk_comfort">Risk Comfort</Label>
                  <Input
                    id="risk_comfort"
                    value={selectedItem.risk_comfort}
                    onChange={(e) => handleInputChange('risk_comfort', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Derived Metrics Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Derived Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_surplus_eur">Monthly Surplus (€)</Label>
                  <Input
                    id="monthly_surplus_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.monthly_surplus_eur}
                    onChange={(e) => handleInputChange('monthly_surplus_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="expense_ratio">Expense Ratio</Label>
                  <Input
                    id="expense_ratio"
                    type="number"
                    step="0.0001"
                    value={selectedItem.expense_ratio}
                    onChange={(e) => handleInputChange('expense_ratio', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="net_additional_cash_flow_eur">Net Additional Cash Flow (€)</Label>
                  <Input
                    id="net_additional_cash_flow_eur"
                    type="number"
                    step="0.01"
                    value={selectedItem.net_additional_cash_flow_eur}
                    onChange={(e) => handleInputChange('net_additional_cash_flow_eur', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="savings_coverage_months">Savings Coverage (months)</Label>
                  <Input
                    id="savings_coverage_months"
                    type="number"
                    step="0.1"
                    value={selectedItem.savings_coverage_months}
                    onChange={(e) => handleInputChange('savings_coverage_months', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="liabilities_to_annual_income">Liabilities to Annual Income</Label>
                  <Input
                    id="liabilities_to_annual_income"
                    type="number"
                    step="0.01"
                    value={selectedItem.liabilities_to_annual_income}
                    onChange={(e) => handleInputChange('liabilities_to_annual_income', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Scoring Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Scoring</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="score_age">Score Age</Label>
                  <Input
                    id="score_age"
                    type="number"
                    value={selectedItem.score_age}
                    onChange={(e) => handleInputChange('score_age', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_family_status">Score Family Status</Label>
                  <Input
                    id="score_family_status"
                    type="number"
                    value={selectedItem.score_family_status}
                    onChange={(e) => handleInputChange('score_family_status', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_kids">Score Kids</Label>
                  <Input
                    id="score_kids"
                    type="number"
                    value={selectedItem.score_kids}
                    onChange={(e) => handleInputChange('score_kids', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_housing">Score Housing</Label>
                  <Input
                    id="score_housing"
                    type="number"
                    value={selectedItem.score_housing}
                    onChange={(e) => handleInputChange('score_housing', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_monthly_income">Score Monthly Income</Label>
                  <Input
                    id="score_monthly_income"
                    type="number"
                    value={selectedItem.score_monthly_income}
                    onChange={(e) => handleInputChange('score_monthly_income', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_expense_ratio">Score Expense Ratio</Label>
                  <Input
                    id="score_expense_ratio"
                    type="number"
                    value={selectedItem.score_expense_ratio}
                    onChange={(e) => handleInputChange('score_expense_ratio', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_income_stability">Score Income Stability</Label>
                  <Input
                    id="score_income_stability"
                    type="number"
                    value={selectedItem.score_income_stability}
                    onChange={(e) => handleInputChange('score_income_stability', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_net_additional_cash_flow">Score Net Additional Cash Flow</Label>
                  <Input
                    id="score_net_additional_cash_flow"
                    type="number"
                    value={selectedItem.score_net_additional_cash_flow}
                    onChange={(e) => handleInputChange('score_net_additional_cash_flow', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_savings_coverage">Score Savings Coverage</Label>
                  <Input
                    id="score_savings_coverage"
                    type="number"
                    value={selectedItem.score_savings_coverage}
                    onChange={(e) => handleInputChange('score_savings_coverage', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_liabilities_load">Score Liabilities Load</Label>
                  <Input
                    id="score_liabilities_load"
                    type="number"
                    value={selectedItem.score_liabilities_load}
                    onChange={(e) => handleInputChange('score_liabilities_load', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="score_risk_comfort">Score Risk Comfort</Label>
                  <Input
                    id="score_risk_comfort"
                    type="number"
                    value={selectedItem.score_risk_comfort}
                    onChange={(e) => handleInputChange('score_risk_comfort', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="total_score">Total Score</Label>
                  <Input
                    id="total_score"
                    type="number"
                    value={selectedItem.total_score}
                    onChange={(e) => handleInputChange('total_score', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity_band">Capacity Band</Label>
                  <Input
                    id="capacity_band"
                    value={selectedItem.capacity_band}
                    onChange={(e) => handleInputChange('capacity_band', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VariablesPage;
