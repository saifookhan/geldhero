"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResponseDetailModal } from "@/components/response-detail-modal";
import {
  Search,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  Filter,
} from "lucide-react";

interface CalculatorResponse {
  id: number;
  email: string;
  age: number;
  currently_living_in: string;
  family_status: string;
  has_kids: string;
  number_of_kids?: number;
  employment_status: string;
  housing_status: string;
  financial_knowledge: string;
  risk_comfort: string;
  monthly_income: string;
  income_stability: string;
  rent_expenditure: number;
  electricity_expenditure: number;
  utilities_expenditure: number;
  transport_expenditure: number;
  groceries_expenditure: number;
  miscellaneous_expenditure: number;
  additional_yearly_income: number;
  additional_yearly_expenditure: number;
  goal_type: string;
  goal_amount?: number;
  goal_amount_range?: string;
  time_horizon: string;
  funding_source: string;
  goal_flexibility: string;
  created_at: string;
  updated_at: string;
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const getRiskColorClass = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "conservative":
      return "bg-green-100 text-green-800";
    case "balanced":
      return "bg-yellow-100 text-yellow-800";
    case "growth":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getGoalColorClass = (goalType: string) => {
  switch (goalType.toLowerCase()) {
    case "travel":
      return "bg-blue-100 text-blue-800";
    case "marriage":
      return "bg-pink-100 text-pink-800";
    case "home-furnishing":
      return "bg-purple-100 text-purple-800";
    case "education":
      return "bg-indigo-100 text-indigo-800";
    case "emergency-fund":
      return "bg-orange-100 text-orange-800";
    case "car":
      return "bg-gray-100 text-gray-800";
    case "investment":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function AdminDashboard() {
  const [responses, setResponses] = useState<CalculatorResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<
    CalculatorResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] =
    useState<CalculatorResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGoalType, setFilterGoalType] = useState("");
  const [filterRiskComfort, setFilterRiskComfort] = useState("");

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("calculator_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResponses(data || []);
      setFilteredResponses(data || []);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    let filtered = responses;

    if (searchTerm) {
      filtered = filtered.filter(
        (response) =>
          response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          response.goal_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          response.employment_status
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterGoalType) {
      filtered = filtered.filter(
        (response) => response.goal_type === filterGoalType
      );
    }

    if (filterRiskComfort) {
      filtered = filtered.filter(
        (response) => response.risk_comfort === filterRiskComfort
      );
    }

    setFilteredResponses(filtered);
  }, [searchTerm, filterGoalType, filterRiskComfort, responses]);

  const handleRowClick = (response: CalculatorResponse) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResponse(null);
  };

  // Get unique values for filters
  const uniqueGoalTypes = [...new Set(responses.map((r) => r.goal_type))];
  const uniqueRiskComforts = [...new Set(responses.map((r) => r.risk_comfort))];

  // Statistics
  const totalResponses = responses.length;
  const avgAge =
    responses.length > 0
      ? Math.round(
          responses.reduce((sum, r) => sum + r.age, 0) / responses.length
        )
      : 0;
  const mostCommonGoal =
    responses.length > 0
      ? responses.reduce((acc, r) => {
          acc[r.goal_type] = (acc[r.goal_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {};
  const topGoal = Object.keys(mostCommonGoal).reduce(
    (a, b) => (mostCommonGoal[a] > mostCommonGoal[b] ? a : b),
    ""
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage calculator responses and view analytics
              </p>
            </div>
            <Button
              onClick={fetchResponses}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Responses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalResponses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Age</p>
                <p className="text-2xl font-bold text-gray-900">{avgAge}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Most Common Goal
                </p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {topGoal.replace("-", " ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredResponses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by email, goal type, or employment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterGoalType}
                onChange={(e) => setFilterGoalType(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Goals</option>
                {uniqueGoalTypes.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <select
                value={filterRiskComfort}
                onChange={(e) => setFilterRiskComfort(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Risk Levels</option>
                {uniqueRiskComforts.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk.replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterGoalType("");
                  setFilterRiskComfort("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Income Range</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredResponses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No responses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponses.map((response) => (
                  <TableRow
                    key={response.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(response)}
                  >
                    <TableCell className="font-medium">
                      {response.email}
                    </TableCell>
                    <TableCell>{response.age}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getGoalColorClass(response.goal_type)}
                      >
                        {response.goal_type.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRiskColorClass(response.risk_comfort)}
                      >
                        {response.risk_comfort}
                      </Badge>
                    </TableCell>
                    <TableCell>{response.monthly_income}</TableCell>
                    <TableCell className="capitalize">
                      {response.employment_status.replace("-", " ")}
                    </TableCell>
                    <TableCell>{formatDate(response.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(response);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Response Detail Modal */}
        <ResponseDetailModal
          response={selectedResponse}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
