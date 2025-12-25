"use client"

import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"

interface CalculatorResponse {
  id: number
  email: string
  age: number
  currently_living_in: string
  family_status: string
  has_kids: string
  number_of_kids?: number
  employment_status: string
  housing_status: string
  financial_knowledge: string
  risk_comfort: string
  monthly_income: string
  income_stability: string
  rent_expenditure: number
  electricity_expenditure: number
  utilities_expenditure: number
  transport_expenditure: number
  groceries_expenditure: number
  miscellaneous_expenditure: number
  additional_yearly_income: number
  additional_yearly_expenditure: number
  goal_type: string
  goal_amount?: number
  goal_amount_range?: string
  time_horizon: string
  funding_source: string
  goal_flexibility: string
  created_at: string
  updated_at: string
}

interface ResponseDetailModalProps {
  response: CalculatorResponse | null
  isOpen: boolean
  onClose: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ResponseDetailModal({ response, isOpen, onClose }: ResponseDetailModalProps) {
  if (!response) return null

  const totalMonthlyExpenditure = 
    response.rent_expenditure +
    response.electricity_expenditure +
    response.utilities_expenditure +
    response.transport_expenditure +
    response.groceries_expenditure +
    response.miscellaneous_expenditure

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Response Details - ${response.email}`}
    >
      <div className="p-6 space-y-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Personal Information
            <Badge variant="outline">Step 1</Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{response.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Age</label>
              <p className="text-gray-900">{response.age} years old</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900">{response.currently_living_in}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Family Status</label>
              <p className="text-gray-900 capitalize">{response.family_status.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Kids</label>
              <p className="text-gray-900 capitalize">
                {response.has_kids}
                {response.has_kids === 'yes' && response.number_of_kids && ` (${response.number_of_kids})`}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment</label>
              <p className="text-gray-900 capitalize">{response.employment_status.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Housing</label>
              <p className="text-gray-900 capitalize">{response.housing_status.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Financial Information
            <Badge variant="outline">Step 2</Badge>
          </h3>
          
          <div className="space-y-6">
            {/* Knowledge & Risk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Financial Knowledge</label>
                <p className="text-gray-900 capitalize">{response.financial_knowledge.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Risk Comfort</label>
                <p className="text-gray-900 capitalize">{response.risk_comfort}</p>
              </div>
            </div>

            {/* Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                <p className="text-gray-900">{response.monthly_income}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Income Stability</label>
                <p className="text-gray-900 capitalize">{response.income_stability}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Additional Yearly Income</label>
                <p className="text-gray-900">{formatCurrency(response.additional_yearly_income)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Additional Yearly Expenditure</label>
                <p className="text-gray-900">{formatCurrency(response.additional_yearly_expenditure)}</p>
              </div>
            </div>

            {/* Monthly Expenditures */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Monthly Expenditures</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Rent</label>
                  <p className="text-gray-900">{formatCurrency(response.rent_expenditure)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Electricity</label>
                  <p className="text-gray-900">{formatCurrency(response.electricity_expenditure)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Utilities</label>
                  <p className="text-gray-900">{formatCurrency(response.utilities_expenditure)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Transport</label>
                  <p className="text-gray-900">{formatCurrency(response.transport_expenditure)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Groceries</label>
                  <p className="text-gray-900">{formatCurrency(response.groceries_expenditure)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Miscellaneous</label>
                  <p className="text-gray-900">{formatCurrency(response.miscellaneous_expenditure)}</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Total Monthly Expenditure</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalMonthlyExpenditure)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Goal Information
            <Badge variant="outline">Step 3</Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Goal Type</label>
              <p className="text-gray-900 capitalize">{response.goal_type.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Goal Amount</label>
              <p className="text-gray-900">
                {response.goal_amount 
                  ? formatCurrency(response.goal_amount)
                  : response.goal_amount_range || 'Not specified'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Time Horizon</label>
              <p className="text-gray-900 capitalize">{response.time_horizon.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Funding Source</label>
              <p className="text-gray-900 capitalize">{response.funding_source.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Goal Flexibility</label>
              <p className="text-gray-900 capitalize">{response.goal_flexibility.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-sm font-medium text-gray-500">Submitted</label>
              <p className="text-gray-700">{formatDate(response.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-700">{formatDate(response.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}