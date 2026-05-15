# Test Plan & Strategy - BharatClean Automation

## 1. Overview
This document outlines the testing strategy for the BharatClean platform using an advanced Selenium Java framework.

## 2. Testing Framework Components
### 2.1 Page Object Model (POM)
- UI elements and interactions are encapsulated in Page classes (e.g., `LandingPage`, `LoginPage`, `SupportPage`).
- Promotes code reuse and maintainability.

### 2.2 TestNG Orchestration
- Parallel execution support for faster feedback.
- XML-based suite configuration (`testng.xml`).
- Custom listeners for reporting and error handling.

### 2.3 BDD (Cucumber)
- Gherkin feature files for business-readable scenarios.
- Integration with TestNG via a dedicated `TestRunner`.

### 2.4 Reporting
- **ExtentReports**: High-level HTML dashboard for executive summaries.
- **Allure Report**: Detailed, interactive technical reports with embedded screenshots and metadata.

## 3. Test Coverage
- **Smoke Tests**: Verify core landing and navigation flows.
- **Functional Tests**: Comprehensive testing of the Support Ticket system.
- **Performance Tests**: Benchmarking critical logic (Vitest) and Load testing APIs (k6).
- **Regression Tests**: Ensure existing booking and auth flows remain stable.

## 4. Execution Environment
- **Browser**: Chrome (Headless mode for CI/CD).
- **Language**: Java 8.
- **Build Tool**: Maven.

## 5. Defect Management
- Automated screenshots are captured on failure.
- Logs are persisted in `target/automation.log`.
