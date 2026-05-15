package com.bharatclean.tests;

import com.bharatclean.utils.DriverManager;
import com.bharatclean.utils.TestListener;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Listeners;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

@Listeners(TestListener.class)
public class BaseTest {

    @BeforeMethod
    @Parameters("browser")
    public void setup(@Optional("chrome") String browser) {
        DriverManager.setDriver(browser != null ? browser : "chrome");
    }

    @AfterMethod
    public void teardown() {
        DriverManager.quitDriver();
    }

    public WebDriver getDriver() {
        return DriverManager.getDriver();
    }
}
