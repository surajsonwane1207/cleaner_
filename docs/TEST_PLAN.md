# Test Plan & Strategy - BharatClean Automation

## 1. Overview
This document outlines the testing strategy for the BharatClean platform using an advanced multi-layered automation approach.

## 2. Testing Layers
### 2.1 E2E UI Testing (Selenium)
- **Framework**: Java 8 + Selenium 3 + TestNG.
- **Pattern**: Page Object Model (POM) with automated screenshot capturing on failure.
- **Journeys Covered**:
    - **Customer**: Register $\rightarrow$ Subscribe $\rightarrow$ Book $\rightarrow$ Logout.
    - **Admin**: Dashboard access $\rightarrow$ User list verification $\rightarrow$ Ticket tracking.
    - **Cleaner**: Portal access $\rightarrow$ Pending jobs $\rightarrow$ Mark job as completed.

### 2.2 Unit & Integration (Vitest)
- High-speed testing of React components and API route logic.
- Mocking of external services (NextAuth, Prisma, Razorpay).

### 2.3 Performance (k6)
- API load testing to ensure high availability and responsiveness under stress.

## 3. Reporting & Monitoring
- **Allure Report**: Comprehensive technical reports with embedded screenshots.
- **Automation Logs**: Real-time logging of test steps in `target/automation.log`.

## 4. Execution Pipeline
- **CI/CD**: Integrated with GitHub Actions.
- **Environments**: Local (Visual/Chrome) and CI (Headless).

## 5. Maintenance
- **Data Stability**: Use of database seeding (`prisma/seed.ts`) ensures consistent state for E2E runs.
- **Reliability**: Javascript-based input handling for complex UI elements like date/time pickers.
