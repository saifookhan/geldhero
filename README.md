# GeldHero - AI Financial Advisor

Your digital AI financial advisor — one of its kind for goal-based financial planning.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- 🎯 Goal-based financial planning
- 🤖 AI-powered insights
- 🔒 GDPR compliant & secure
- 🇩🇪 Designed for Germany
- 📱 Responsive design
- ⚡ Fast and modern

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components inspired by shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Font**: Google Fonts (Outfit)
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── dashboard/         # Dashboard page
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── header.tsx         # Site header
│   ├── hero-section.tsx   # Hero section
│   ├── features-section.tsx # Features section
│   ├── faq-section.tsx    # FAQ section
│   └── footer.tsx         # Site footer
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # General utilities
└── docs/                  # Documentation
    └── 01-tasks.MD        # Project requirements
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Digital Ocean**

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
