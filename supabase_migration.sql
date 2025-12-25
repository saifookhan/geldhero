-- Create the calculator_responses table
CREATE TABLE IF NOT EXISTS calculator_responses (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  currently_living_in TEXT DEFAULT 'Germany',
  family_status TEXT NOT NULL,
  has_kids TEXT NOT NULL,
  number_of_kids INTEGER,
  employment_status TEXT NOT NULL,
  housing_status TEXT NOT NULL,
  financial_knowledge TEXT NOT NULL,
  risk_comfort TEXT NOT NULL,
  monthly_income TEXT NOT NULL,
  income_stability TEXT NOT NULL,
  rent_expenditure DECIMAL DEFAULT 0,
  electricity_expenditure DECIMAL DEFAULT 0,
  utilities_expenditure DECIMAL DEFAULT 0,
  transport_expenditure DECIMAL DEFAULT 0,
  groceries_expenditure DECIMAL DEFAULT 0,
  miscellaneous_expenditure DECIMAL DEFAULT 0,
  additional_yearly_income DECIMAL DEFAULT 0,
  additional_yearly_expenditure DECIMAL DEFAULT 0,
  goal_type TEXT NOT NULL,
  goal_amount DECIMAL,
  goal_amount_range TEXT,
  time_horizon TEXT NOT NULL,
  funding_source TEXT NOT NULL,
  goal_flexibility TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_calculator_responses_email ON calculator_responses(email);

-- Create an index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_calculator_responses_created_at ON calculator_responses(created_at);

-- Update the updated_at timestamp when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calculator_responses_updated_at
    BEFORE UPDATE ON calculator_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();