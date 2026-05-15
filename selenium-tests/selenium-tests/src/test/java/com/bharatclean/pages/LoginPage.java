package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage extends BasePage {

    @FindBy(xpath = "//*[contains(text(), 'Welcome back')]")
    private WebElement welcomeHeader;

    @FindBy(id = "email")
    private WebElement emailInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(xpath = "//button[@type='submit']")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public boolean isWelcomeHeaderDisplayed() {
        waitForVisibility(welcomeHeader);
        return welcomeHeader.isDisplayed();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public void login(String email, String password) {
        writeText(emailInput, email);
        writeText(passwordInput, password);
        click(loginButton);
    }
}
