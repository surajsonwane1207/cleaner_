# System Architecture - BharatClean

## 1. Technology Stack
- **Frontend**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes (Node.js runtime)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Beta)
- **Payments**: Razorpay SDK

## 2. Infrastructure Diagram (Logical)
![System Design Diagram](./images/system_design.svg)

## 3. UI Design (Wireframes)
### Landing Page
![Landing Page Wireframe](./images/wireframe_landing.svg)

## 4. Automation Stack
- **Language**: Java 8
- **Engine**: Selenium 3.141.59
- **Orchestration**: TestNG 7.4.0
- **BDD**: Cucumber 7.2.3
- **Drivers**: WebDriverManager
- **Reporting**: Allure 2.17.3 + ExtentReports 4.1.7

## 4. Key Design Patterns
- **Singleton**: Used in `DriverManager` for thread-safe WebDriver sessions.
- **Page Object Model (POM)**: Decouples test logic from UI structure.
- **Layered Architecture**: Separation between UI, API logic, and Database access.
