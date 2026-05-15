package com.bharatclean.tests;

import com.bharatclean.pages.*;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;
import java.util.UUID;

@Epic("E2E Automation")
@Feature("Full User Journey")
public class EndToEndTestNG extends BaseTest {

    @Test(description = "Full User Journey: Register -> Login -> Subscribe -> Book -> Logout")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Comprehensive test covering the entire user lifecycle.")
    @Story("User Journey")
    public void testFullUserJourney() throws InterruptedException {
        Log.info("Starting testFullUserJourney");
        String uniqueEmail = "testuser_" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
        String password = "password123";
        String name = "E2E Test User";

        getDriver().get("http://localhost:3000");
        LandingPage landingPage = new LandingPage(getDriver());
        
        // 1. Register
        Log.info("Step 1: Registering new user: " + uniqueEmail);
        landingPage.clickRegister();
        RegisterPage registerPage = new RegisterPage(getDriver());
        registerPage.register(name, uniqueEmail, password);
        
        // 2. Login
        Log.info("Step 2: Logging in");
        WebDriverWait wait = new WebDriverWait(getDriver(), 30);
        wait.until(ExpectedConditions.urlContains("login"));
        
        // Sometimes the redirect state causes issues, let's refresh or navigate directly
        getDriver().get("http://localhost:3000/login");
        Thread.sleep(2000); // Small wait for page stabilization
        
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.login(uniqueEmail, password);
        
        // 3. Subscribe to Service
        Log.info("Step 3: Selecting service and paying");
        wait.until(ExpectedConditions.urlContains("dashboard"));
        
        DashboardPage dashboardPage = new DashboardPage(getDriver());
        Assert.assertTrue(dashboardPage.isWelcomeHeaderDisplayed(), "Should be on dashboard");
        dashboardPage.clickBrowsePlans();
        
        wait.until(ExpectedConditions.urlContains("#pricing"));
        landingPage.clickSubscribeNow();
        
        SubscribePage subscribePage = new SubscribePage(getDriver());
        subscribePage.clickSimulateSuccess();
        
        // 4. Book Cleaning
        Log.info("Step 4: Booking a cleaning");
        wait.until(ExpectedConditions.urlContains("subscribed=true"));
        Assert.assertTrue(dashboardPage.isPlanActive("Basic Weekly"), "Plan should be active");
        Thread.sleep(2000); // Wait for hydration
        dashboardPage.clickBookCleaning();
        
        wait.until(ExpectedConditions.urlContains("book"));
        BookingPage bookingPage = new BookingPage(getDriver());
        Log.info("Filling booking details");
        bookingPage.fillBookingDetails("2026-06-01", "10:00", "123 Test Street, E2E City", "Please clean thoroughly.");
        
        // 5. Logout
        Log.info("Step 5: Logging out");
        wait.until(ExpectedConditions.urlContains("booked=true"));
        Assert.assertTrue(dashboardPage.isWelcomeHeaderDisplayed(), "Should be back on dashboard");
        dashboardPage.logout();
        
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlToBe("http://localhost:3000/"),
            ExpectedConditions.urlContains("login")
        ));
        Log.info("Finished testFullUserJourney successfully");
    }
}
