package com.bharatclean.utils;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import io.qameta.allure.Attachment;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestListener implements ITestListener {

    private static String getTestMethodName(ITestResult iTestResult) {
        return iTestResult.getMethod().getConstructorOrMethod().getName();
    }

    @Override
    public void onStart(ITestContext iTestContext) {
        Log.info("Starting Tests in " + iTestContext.getName());
        ExtentManager.createExtentReports();
    }

    @Override
    public void onFinish(ITestContext iTestContext) {
        Log.info("Finishing Tests in " + iTestContext.getName());
        ExtentManager.extentReports.flush();
    }

    @Override
    public void onTestStart(ITestResult iTestResult) {
        Log.info(getTestMethodName(iTestResult) + " test is starting.");
    }

    @Override
    public void onTestSuccess(ITestResult iTestResult) {
        Log.info(getTestMethodName(iTestResult) + " test is successful.");
    }

    @Override
    public void onTestFailure(ITestResult iTestResult) {
        Log.error(getTestMethodName(iTestResult) + " test is failed.");
        WebDriver driver = DriverManager.getDriver();
        if (driver != null) {
            saveScreenshot(driver, getTestMethodName(iTestResult));
            saveAllureScreenshot(driver);
        }
    }

    @Attachment(value = "Page screenshot", type = "image/png")
    public byte[] saveAllureScreenshot(WebDriver driver) {
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }

    @Override
    public void onTestSkipped(ITestResult iTestResult) {
        Log.warn(getTestMethodName(iTestResult) + " test is skipped.");
    }

    private void saveScreenshot(WebDriver driver, String methodName) {
        File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String fileName = methodName + "_" + timestamp + ".png";
        try {
            Path path = Paths.get("./screenshots");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            Files.copy(scrFile.toPath(), path.resolve(fileName));
            Log.info("Screenshot saved: " + fileName);
        } catch (IOException e) {
            Log.error("Failed to save screenshot: " + e.getMessage());
        }
    }
}
