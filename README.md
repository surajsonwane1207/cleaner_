# BharatClean - Professional Cleaning Subscription Platform

BharatClean is a comprehensive full-stack web application designed for professional cleaning services in India. It connects customers with professional cleaners through a subscription-based model, featuring automated booking, real-time management, and secure payments.

## 🚀 Key Features

### 👤 User Roles
- **Customer**: Browse plans, subscribe via Razorpay, book cleaning sessions, and provide feedback.
- **Cleaner**: Manage assigned jobs, mark tasks as completed, and view job history.
- **Admin**: System-wide dashboard with user management, global booking overview, and support ticket tracking.

### 🛠 Technical Capabilities
- **Authentication**: Secure role-based access control (RBAC) using NextAuth.js.
- **Subscriptions**: Recurring billing integration with Razorpay.
- **Support System**: Public and private support portal with ticket management.
- **Full Automation**: Extensive Selenium E2E test suite covering all user journeys.
- **Deployment Ready**: Optimized Docker configurations and CI/CD pipelines.

## 🛠 Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Payments**: Razorpay
- **Testing**: Selenium (E2E), Vitest (Unit), k6 (Performance)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 24+
- Java 8 (for Selenium tests)
- Maven (for Selenium tests)

### 2. Installation
```bash
git clone https://github.com/surajsonwane1207/cleaner_.git
cd cleaner_
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (refer to `.env.example`):
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key"
RAZORPAY_KEY_ID="your-id"
RAZORPAY_KEY_SECRET="your-secret"
RESEND_API_KEY="your-key"
```

### 4. Database Initialization
```bash
npx prisma db push
npm run prisma:seed # Pre-fills Admin, Cleaner, and Plans
```

### 5. Start Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Selenium E2E Tests
Tests are located in `selenium-tests/`.
```bash
cd selenium-tests/selenium-tests
mvn test
```
*Note: Visual execution is enabled by default. Screenshots are saved in `screenshots/` on failure.*

### Unit & Performance
```bash
npm run test       # Vitest
npm run test:load  # k6 Load testing
```

## 🚢 Deployment

### Docker Compose (Local Development)
Orchestrates Next.js and PostgreSQL for a production-like local environment.
```bash
docker-compose up --build
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Kubernetes
Deployment manifests are located in the `k8s/` directory.
1. Apply secrets and configurations:
   ```bash
   kubectl apply -f k8s/secrets.yaml
   ```
2. Deploy PostgreSQL:
   ```bash
   kubectl apply -f k8s/postgres.yaml
   ```
3. Deploy BharatClean Web:
   ```bash
   kubectl apply -f k8s/web.yaml
   ```

### Netlify
The project is configured for Netlify via `netlify.toml`. 
- **Build Command**: `npx prisma generate && next build`
- **Publish Directory**: `.next`
- **Requirement**: Use a remote PostgreSQL database for production.

## 📄 Documentation
Detailed technical documentation is available in the `docs/` folder:
- [Architecture](./docs/ARCHITECTURE.md)
- [Requirements (SRS)](./docs/SRS.md)
- [Functional Requirements (FRD)](./docs/FRD.md)
- [Test Plan](./docs/TEST_PLAN.md)

---
Built with ❤️ for a Spotless India.
