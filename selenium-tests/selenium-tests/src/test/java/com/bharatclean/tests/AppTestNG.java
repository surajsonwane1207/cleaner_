package com.bharatclean.tests;

import com.bharatclean.pages.LandingPage;
import com.bharatclean.pages.LoginPage;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("UI Automation")
@Feature("Landing and Login Features")
public class AppTestNG extends BaseTest {

    @Test(description = "Verify Landing Page Title and Hero Text")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Test to verify the basic elements on the landing page.")
    @Story("Landing Page UI")
    public void testLandingPage() {
        Log.info("Starting testLandingPage");
        getDriver().get("http://localhost:3001");
        
        LandingPage landingPage = new LandingPage(getDriver());
        
        checkTitle(landingPage, "BharatClean");
        Assert.assertTrue(landingPage.isHeroTextDisplayed(), "Hero text should be displayed");
        Log.info("Finished testLandingPage");
    }

    @Step("Verify title contains {0}")
    public void checkTitle(LandingPage page, String expected) {
        Assert.assertTrue(page.getPageTitle().contains(expected), "Title should contain " + expected);
    }

    @Test(description = "Verify Navigation to Login Page")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test to verify navigation from landing to login page.")
    @Story("Login Navigation")
    public void testNavigationToLogin() {
        Log.info("Starting testNavigationToLogin");
        getDriver().get("http://localhost:3001");
        
        LandingPage landingPage = new LandingPage(getDriver());
        clickLoginButton(landingPage);
        
        LoginPage loginPage = new LoginPage(getDriver());
        
        Assert.assertTrue(loginPage.isWelcomeHeaderDisplayed(), "Login page header should be displayed");
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/login"), "URL should contain /login");
        Log.info("Finished testNavigationToLogin");
    }

    @Step("Click Login button on landing page")
    public void clickLoginButton(LandingPage page) {
        page.clickLogin();
    }
}
