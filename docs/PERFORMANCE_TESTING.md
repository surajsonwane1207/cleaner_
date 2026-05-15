# Performance Testing Guide

This project uses two types of performance testing:
1. **Benchmarking**: To measure the performance of specific functions and logic.
2. **Load Testing**: To simulate realistic user traffic and stress test the system.

## 1. Benchmarking (Vitest)

We use `vitest bench` to run benchmarks. These tests are located in `src/__tests__/performance/`.

### Running Benchmarks
```bash
npm run test:bench
```

### Purpose
Use benchmarks for:
- Complex data processing logic.
- Performance-critical algorithms.
- Comparing multiple implementations of the same logic.

## 2. Load Testing (k6)

We use [k6](https://k6.io/) for load testing. The scripts are located in `performance-tests/`.

### Prerequisites
You need to have `k6` installed on your machine.
- **macOS**: `brew install k6`
- **Linux**: `sudo gpg -k && sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list && sudo apt-get update && sudo apt-get install k6`
- **Windows**: `winget install k6`

### Running Load Tests
Make sure the application is running (e.g., `npm run dev`) and then run:
```bash
npm run test:load
```

If you don't have `k6` installed, you can use the fallback Node.js script:
```bash
node performance-tests/fallback-load.cjs
```

You can also specify a different base URL:
```bash
BASE_URL=https://your-staging-site.com k6 run performance-tests/load-test.js
```

### Thresholds
Our load tests have built-in thresholds:
- **http_req_duration**: 95% of requests must complete below 500ms.
- **http_req_failed**: Less than 1% of requests should fail.

## 3. Best Practices
- Run benchmarks during development when optimizing code.
- Run load tests before major releases or after significant architectural changes.
- Always run load tests against a environment that closely mirrors production (not just localhost).
