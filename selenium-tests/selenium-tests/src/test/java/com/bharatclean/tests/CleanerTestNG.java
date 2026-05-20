package com.bharatclean.tests;

import com.bharatclean.pages.LoginPage;
import com.bharatclean.pages.CleanerPage;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("UI Automation")
@Feature("Cleaner Portal")
public class CleanerTestNG extends BaseTest {

    @Test(description = "Full Cleaner Journey: Login -> View Jobs -> Complete Job -> Verify History")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Comprehensive test covering the cleaner workflow.")
    @Story("Cleaner Journey")
    public void testCleanerFullJourney() throws InterruptedException {
        Log.info("Starting testCleanerFullJourney");
        
        getDriver().get("http://localhost:3001/login");
        LoginPage loginPage = new LoginPage(getDriver());
        
        Log.info("Step 1: Logging in as Cleaner");
        loginPage.login("cleaner1@cleaners.com", "password123");
        
        WebDriverWait wait = new WebDriverWait(getDriver(), 30);
        wait.until(ExpectedConditions.urlContains("dashboard"));
        
        Log.info("Step 2: Navigating to Cleaner Portal");
        getDriver().get("http://localhost:3001/dashboard/cleaner");
        
        CleanerPage cleanerPage = new CleanerPage(getDriver());
        Assert.assertTrue(cleanerPage.isPortalHeaderDisplayed(), "Cleaner Portal header should be displayed");
        
        int initialCompletedCount = cleanerPage.getCompletedJobCount();
        Log.info("Initial completed jobs: " + initialCompletedCount);
        
        Log.info("Step 3: Marking a job as completed");
        cleanerPage.markFirstJobAsCompleted();
        
        // Wait for the page to revalidate/refresh
        Thread.sleep(3000); 
        
        Log.info("Step 4: Verifying job history update");
        int finalCompletedCount = cleanerPage.getCompletedJobCount();
        Log.info("Final completed jobs: " + finalCompletedCount);
        
        Assert.assertTrue(finalCompletedCount > initialCompletedCount, "Completed job count should have increased");
        
        Log.info("Step 5: Logging out");
        getDriver().get("http://localhost:3001/api/auth/signout"); // Direct logout for speed in this role test
        
        Log.info("Finished testCleanerFullJourney successfully");
    }
}
