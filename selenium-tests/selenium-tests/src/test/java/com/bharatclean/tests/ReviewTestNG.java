package com.bharatclean.tests;

import com.bharatclean.pages.LandingPage;
import com.bharatclean.pages.LoginPage;
import com.bharatclean.utils.Log;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

@Epic("UI Automation")
@Feature("Review System")
public class ReviewTestNG extends BaseTest {

    @Test(description = "Verify Review Submission UI")
    @Severity(SeverityLevel.NORMAL)
    @Description("Test to verify that the review page loads and can be submitted (simulated).")
    @Story("Review Submission")
    public void testReviewPageLoad() {
        Log.info("Starting testReviewPageLoad");
        // We go directly to a dummy rate page for testing purposes
        getDriver().get("http://localhost:3001/dashboard/rate/dummy-id");
        
        WebElement header = getDriver().findElement(By.xpath("//*[contains(text(), 'Rate your Cleaning Session')]"));
        Assert.assertTrue(header.isDisplayed(), "Review page header should be displayed");
        
        // Select 5 stars (the 5th button in the gap-2 flex container)
        WebElement fifthStar = getDriver().findElement(By.xpath("(//div[contains(@class, 'flex')]//button)[5]"));
        fifthStar.click();
        
        WebElement commentBox = getDriver().findElement(By.tagName("textarea"));
        commentBox.sendKeys("Excellent service!");
        
        WebElement submitButton = getDriver().findElement(By.xpath("//button[@type='submit']"));
        Assert.assertTrue(submitButton.isEnabled(), "Submit button should be enabled after rating");
        
        Log.info("Finished testReviewPageLoad");
    }
}
