package com.bharatclean.tests;

import com.bharatclean.pages.LoginPage;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("UI Automation")
@Feature("Admin Dashboard")
public class AdminTestNG extends BaseTest {

    @Test(description = "Verify Admin Dashboard Ticket List")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test to verify that the admin can login and see support tickets.")
    @Story("Admin Management")
    public void testAdminDashboard() throws InterruptedException {
        Log.info("Starting testAdminDashboard");
        
        getDriver().get("http://localhost:3001/login");
        LoginPage loginPage = new LoginPage(getDriver());
        
        Log.info("Logging in as Admin");
        loginPage.login("admin@cleaners.com", "password123");
        
        WebDriverWait wait = new WebDriverWait(getDriver(), 30);
        wait.until(ExpectedConditions.urlContains("dashboard"));
        
        Log.info("Navigating to Admin Dashboard");
        getDriver().get("http://localhost:3001/dashboard/admin");
        
        wait.until(ExpectedConditions.urlContains("admin"));
        
        WebElement header = getDriver().findElement(By.xpath("//h1[contains(text(), 'Admin Dashboard')]"));
        Assert.assertTrue(header.isDisplayed(), "Admin Dashboard header should be displayed");
        
        WebElement ticketTable = getDriver().findElement(By.tagName("table"));
        Assert.assertTrue(ticketTable.isDisplayed(), "Support tickets table should be visible");
        
        Log.info("Admin Dashboard verified successfully");
        Log.info("Finished testAdminDashboard");
    }
}
