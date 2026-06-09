# Rolefit - AI-Powered Resume Tailoring

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Rolefit** helps job seekers tailor their resumes and cover letters to specific job descriptions. Paste a job description, pick what to emphasize, and export polished PDFs that match keywords naturally — without rewriting your entire career.

## ✨ Features

- **🎯 Smart Keyword Matching** - Extracts responsibilities, skills, and keywords from any job description
- **📄 Dual Output** - Generate both resumes and cover letters from a single profile
- **🎨 Multiple Styles** - Choose from Bold, Minimalistic, or Classic templates for both documents
- **⚡ One-Click Export** - Download clean, ATS-friendly PDFs ready for submission
- **🔄 Infinite Swiper** - Browse templates with smooth drag/swipe interactions
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + GSAP animations
- **Animations**: Framer Motion, GSAP
- **Authentication**: Custom Auth Context
- **UI Components**: shadcn/ui
- **PDF Generation**: Custom export logic
- **State Management**: React Hooks + Context API

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rolefit-frontend.git
cd rolefit-frontend
``
Install dependencies

```bash

npm install
# or
yarn install
# or
pnpm install
```
Set up environment variables

```bash
cp .env.local.example .env
```
Fill in your environment variables:

```env
NEXT_PUBLIC_SERVER_API_URL=your_api_endpoint
```
# Add other required env vars
Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open http://localhost:3000 to see the result

📁 Project Structure
text
rolefit-frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (profile)/         # User profile management
│   ├── jd/                # Job description handling
│   └── page.tsx           # Landing page
├── components/
│   ├── global/            # Reusable components
│   │   ├── HeroSection.tsx
│   │   ├── TemplateShowcase.tsx
│   │   └── GooeyTransition.tsx
│   ├── ui/                # shadcn/ui components
│   └── Header.tsx
├── context/               # React Context providers
│   └── AuthContext.tsx
|   └── WebSocketContext.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── demo/              `   # Demo images for templates
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
🎨 Key Components
HeroSection
Animated hero with GSAP-powered card expansion animation:

Small centered card appears first

Smooth expansion to full width

Staggered content fade-in

TemplateShowcase
Interactive template browser with infinite swipe:

Drag/swipe to browse 6 templates (3 resume + 3 cover letter styles)

Left card stack effect, right card extended effect

Style labels displayed above each template

Built with Framer Motion for smooth physics-based animations

🛠️ Development
Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler
```
Adding New Templates
Add template images to /public/demo/

Update the templates array in TemplateShowcase.tsx:

typescript
{
  id: 7,
  type: "resume", // or "cover"
  style: "Modern",
  image: "/demo/resume_modern.png"
}
Customizing Animations
GSAP animations: Edit HeroSection.tsx timeline

Framer Motion: Adjust spring physics in TemplateShowcase.tsx

Transition effects: Modify GooeyTransition.tsx

🎯 Core Workflow
Create Profile - Add your work experience, education, and skills once

Paste Job Description - Rolefit extracts keywords and requirements

Select Style - Choose Bold, Minimalistic, or Classic template

Review & Export - Download tailored resume and cover letter as PDF

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
Distributed under the MIT License. See LICENSE for more information.

📧 Contact
ShadowAdi

Project Link: https://github.com/ShadowAdi/rolefit-frontend

🙏 Acknowledgments
Next.js - React framework

Tailwind CSS - Styling

Framer Motion - Animations

GSAP - Advanced animations

shadcn/ui - UI components

