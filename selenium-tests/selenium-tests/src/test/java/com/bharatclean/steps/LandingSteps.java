package com.bharatclean.steps;

import com.bharatclean.pages.LandingPage;
import com.bharatclean.utils.DriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.testng.Assert;

public class LandingSteps {

    LandingPage landingPage;

    @Given("I am on the BharatClean landing page")
    public void i_am_on_the_bharat_clean_landing_page() {
        DriverManager.getDriver().get("http://localhost:3001");
        landingPage = new LandingPage(DriverManager.getDriver());
    }

    @Then("I should see the title containing {string}")
    public void i_should_see_the_title_containing(String expectedTitle) {
        Assert.assertTrue(landingPage.getPageTitle().contains(expectedTitle));
    }

    @Then("I should see the hero text {string}")
    public void i_should_see_the_hero_text(String expectedText) {
        Assert.assertTrue(landingPage.isHeroTextDisplayed());
    }
}
