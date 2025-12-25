I am creating a fin-tech platform which is B2C and need a responsive webapp.

Create a landing page for me. The header will scroll to the specific section.

## **Project Description & Background**

- **Problem:** Many people earn enough but lack clarity on whether their life goals (e.g. car, travel, home) are financially realistic. Existing tools focus on products or investing, not goal feasibility and planning.

- **Solution:** A digital, AI-powered financial planning platform that turns personal finances (income, expenses, assets) into a clear, goal-based action plan within minutes.

- **How it works:** Users enter basic financial data and define up to three goals. The system evaluates cash flow, risk comfort, and time horizon to assess feasibility and suggest concrete next steps.

- **Value:** Users get immediate clarity on what they can afford, how much to save, and by when — without sales pressure, complex jargon, or product recommendations.

- **Scope (MVP):** Planning-only, Germany-focused, GDPR-compliant. No execution, no investment advice, no product selling — designed to validate demand for goal-based financial planning before scaling.
- Sample websites:
  - [https://tendi.ai/](https://tendi.ai/)
  - Revolut
  - finanzguru

## **Features**

- Features: Account creation
  - Enter your details: As available in Excel
  - Enter your goal
- We evaluate your demographic and risk profile and based on that suggest:
  - What financial products are available to you (investments/lending products)
  - Optimize your contracts to save you money
- All your financial advice at one place
- After logging in, a user can create their financial data (to be added later)
  - For now just create a logging in function.

## **Pages**

- Landing Page: (make it like tendi.ai)
  - Make it one pager.
  - Header in the middle:
  - Hero: Your digital AI financial advisor — one of its kind for goal-based financial planning
  - Stepper form (to be added later)
  - Features section
  - FAQ section
  - Footer
- Dashboard
  - just create a dashboard page with a welcome message
- Login/signup

## **Tech**

- Nextjs+turbo app for frontend \+ backend /app routing
- \- use nextjs, Use /app routing
- Create routes for products, profile, authentication, notification, messages, search, etc.
- Color: \#272757 (midnight blue), black and white
- Database supabase (.env values given)
- Authentication: supabase authentication
- Use a design library: shadcn
- \- Use tailwind
- \- Make components
- \- font: outfit https://fonts.google.com/specimen/Outfit

.env:
NEXT_PUBLIC_SUPABASE_URL=https://jmwshthfzhztfmfkossk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_XWm5RAaRN5WEdfGbMJcGPA_fP47FHVG
