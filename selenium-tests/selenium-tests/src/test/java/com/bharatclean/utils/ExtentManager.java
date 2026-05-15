package com.bharatclean.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;

public class ExtentManager {
    public static final ExtentReports extentReports = new ExtentReports();

    public synchronized static ExtentReports createExtentReports() {
        ExtentHtmlReporter reporter = new ExtentHtmlReporter("./extent-reports/extent-report.html");
        reporter.config().setReportName("BharatClean Automation Report");
        extentReports.attachReporter(reporter);
        extentReports.setSystemInfo("Framework", "Selenium POM");
        extentReports.setSystemInfo("Author", "Gemini CLI");
        return extentReports;
    }
}
