package com.bharatclean.tests;

import com.bharatclean.pages.SupportPage;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("UI Automation")
@Feature("Support Feature")
public class SupportTestNG extends BaseTest {

    @Test(description = "Verify Support Ticket Submission")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test to verify that a user can submit a support ticket.")
    @Story("Support Ticket Submission")
    public void testSupportSubmission() {
        Log.info("Starting testSupportSubmission");
        getDriver().get("http://localhost:3000/support");
        
        SupportPage supportPage = new SupportPage(getDriver());
        
        fillSupportDetails(supportPage, "Test User", "testuser@example.com", "Test Subject", "This is a test message for support.");
        supportPage.submitForm();
        
        Assert.assertTrue(supportPage.isSuccessMessageDisplayed(), "Success message should be displayed after form submission");
        Log.info("Finished testSupportSubmission");
    }

    @Step("Fill support form with details")
    public void fillSupportDetails(SupportPage page, String name, String email, String subject, String message) {
        page.fillSupportForm(name, email, subject, message);
    }
}
