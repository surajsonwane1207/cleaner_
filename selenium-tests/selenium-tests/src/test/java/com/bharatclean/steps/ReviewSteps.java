package com.bharatclean.steps;

import com.bharatclean.utils.DriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.testng.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ReviewSteps {

    @Given("I am on the BharatClean rating page for a completed booking")
    public void i_am_on_rating_page() {
        DriverManager.getDriver().get("http://localhost:3001/dashboard/rate/dummy-id");
    }

    @When("I select a 5-star rating")
    public void i_select_rating() {
        WebElement fifthStar = DriverManager.getDriver().findElement(By.xpath("(//div[contains(@class, 'flex')]//button)[5]"));
        fifthStar.click();
    }

    @When("I enter a comment {string}")
    public void i_enter_comment(String comment) {
        WebElement commentBox = DriverManager.getDriver().findElement(By.tagName("textarea"));
        commentBox.sendKeys(comment);
    }

    @When("I submit the review form")
    public void i_submit_form() {
        WebElement submitButton = DriverManager.getDriver().findElement(By.xpath("//button[@type='submit']"));
        submitButton.click();
    }

    @Then("I should see a thank you message and be redirected")
    public void i_should_see_success() {
        WebElement successMsg = DriverManager.getDriver().findElement(By.xpath("//*[contains(text(), 'Thank you')]"));
        Assert.assertTrue(successMsg.isDisplayed());
    }
}
