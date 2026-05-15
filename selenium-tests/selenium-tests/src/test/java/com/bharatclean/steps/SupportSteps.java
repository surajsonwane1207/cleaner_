package com.bharatclean.steps;

import com.bharatclean.pages.SupportPage;
import com.bharatclean.utils.DriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.testng.Assert;

public class SupportSteps {

    SupportPage supportPage;

    @Given("I am on the BharatClean support page")
    public void i_am_on_the_bharat_clean_support_page() {
        DriverManager.getDriver().get("http://localhost:3000/support");
        supportPage = new SupportPage(DriverManager.getDriver());
    }

    @When("I enter my name, email, subject, and message")
    public void i_enter_my_details() {
        supportPage.fillSupportForm("Cucumber User", "cucu@example.com", "Cucumber Test", "This is from BDD test.");
    }

    @When("I submit the support form")
    public void i_submit_the_form() {
        supportPage.submitForm();
    }

    @Then("I should see a success message indicating the ticket was submitted")
    public void i_should_see_success_message() {
        Assert.assertTrue(supportPage.isSuccessMessageDisplayed());
    }
}
