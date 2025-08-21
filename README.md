## Generate a single result file to Allure Report
allure generate --single-file allure-results\report-07-20-23-27-47 --clean 
allure open index.html

## Report
Generate Allure report
npm run report:generate

Open Allure report
npm run report:open

Xóa kết quả cũ (allure-results + allure-report)
npm run report:clean

## Run test
Chạy toàn bộ test
npm run test

Chạy login.test.ts
npm run test:login
 
# Chrome 
Chạy test với Chrome (ENV=qa) - default
npm run test:chrome

Chạy test với Chrome (ENV=dev)
npm run test:dev-chrome

# Firefox
Chạy test với Firefox (ENV=qa) - default
npm run test:firefox

Chạy test với Firefox (ENV=dev)
npm run test:dev-firefox

# Webkit
Chạy test với Webkit (ENV=qa) - default
npm run test:webkit

Chạy test với Webkit (ENV=dev)
npm run test:dev-webkit