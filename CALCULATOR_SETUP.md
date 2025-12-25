# Calculator Form Setup Instructions

## Database Setup (Supabase)

1. **Create the database table**: Run the SQL commands in `supabase_migration.sql` in your Supabase SQL editor:

   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase_migration.sql`
   - Run the query

2. **Environment Variables**: Make sure you have these environment variables set in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   ```

## Features Included

✅ **3-Step Stepper Form**

- Personal Information (Email, Age, Family Status, etc.)
- Financial Information (Income, Expenses, Risk Comfort)
- Goals (Goal Type, Amount, Timeline, etc.)

✅ **Responsive Design**

- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface

✅ **Form Validation**

- Zod schema validation
- Real-time error messages
- Required field validation

✅ **Database Integration**

- Supabase integration
- Flexible schema (strings/numbers as requested)
- Automatic timestamps

✅ **User Experience**

- 7-minute completion time indicator
- Progress indicator
- Success confirmation
- Conditional fields (kids number, goal amount vs range)

## Database Schema

The `calculator_responses` table includes:

- Personal info: email, age, family status, kids, employment, housing
- Financial info: knowledge level, risk comfort, income/expenses
- Goals: type, amount, timeline, funding source, flexibility
- Timestamps: created_at, updated_at

## Pages

- `/calculator` - Main form page with stepper interface

## Components

- `CalculatorForm` - Main form component with 3 steps
- `Stepper` - Visual step indicator
- UI components: Button, Input, Label, Select

## Usage

1. Navigate to `/calculator`
2. Fill out the 3-step form
3. Form data is automatically saved to Supabase
4. Success message is shown upon completion

The form is fully responsive and will adapt to different screen sizes. All fields are properly validated and the user experience is optimized for quick completion.
