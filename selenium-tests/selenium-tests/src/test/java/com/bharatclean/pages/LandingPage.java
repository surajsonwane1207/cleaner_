package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LandingPage extends BasePage {

    @FindBy(xpath = "//h1[contains(text(), 'Professional Cleaning')]")
    private WebElement heroText;

    @FindBy(linkText = "Login")
    private WebElement loginLink;

    @FindBy(linkText = "Register")
    private WebElement registerLink;

    @FindBy(linkText = "Subscribe Now")
    private WebElement subscribeNowButton;

    public LandingPage(WebDriver driver) {
        super(driver);
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public boolean isHeroTextDisplayed() {
        return heroText.isDisplayed();
    }

    public void clickLogin() {
        click(loginLink);
    }

    public void clickRegister() {
        click(registerLink);
    }

    public void clickSubscribeNow() {
        click(subscribeNowButton);
    }
}
