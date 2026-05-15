package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class DashboardPage extends BasePage {

    @FindBy(xpath = "//h1[contains(text(), 'Welcome')]")
    private WebElement welcomeHeader;

    @FindBy(linkText = "Book a Cleaning")
    private WebElement bookButton;

    @FindBy(linkText = "Browse Plans")
    private WebElement browsePlansLink;

    @FindBy(xpath = "//div[contains(text(), 'Basic Weekly')]")
    private WebElement activePlanText;

    @FindBy(xpath = "//button[contains(@class, 'rounded-full')]")
    private WebElement profileMenuButton;

    @FindBy(xpath = "//button[text()='Sign Out']")
    private WebElement signOutButton;

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public boolean isWelcomeHeaderDisplayed() {
        waitForVisibility(welcomeHeader);
        return welcomeHeader.isDisplayed();
    }

    public void clickBookCleaning() {
        click(bookButton);
    }

    public void clickBrowsePlans() {
        click(browsePlansLink);
    }

    public boolean isPlanActive(String planName) {
        waitForVisibility(activePlanText);
        return activePlanText.getText().contains(planName);
    }

    public void logout() {
        click(profileMenuButton);
        click(signOutButton);
    }
}
