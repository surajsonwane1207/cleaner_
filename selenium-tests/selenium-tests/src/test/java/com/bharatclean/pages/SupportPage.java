package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SupportPage extends BasePage {

    @FindBy(id = "name")
    private WebElement nameInput;

    @FindBy(id = "email")
    private WebElement emailInput;

    @FindBy(id = "subject")
    private WebElement subjectInput;

    @FindBy(id = "message")
    private WebElement messageInput;

    @FindBy(xpath = "//button[@type='submit']")
    private WebElement submitButton;

    @FindBy(xpath = "//*[contains(text(), 'Support ticket submitted successfully')]")
    private WebElement successMessage;

    public SupportPage(WebDriver driver) {
        super(driver);
    }

    public void fillSupportForm(String name, String email, String subject, String message) {
        writeText(nameInput, name);
        writeText(emailInput, email);
        writeText(subjectInput, subject);
        writeText(messageInput, message);
    }

    public void submitForm() {
        waitForVisibility(submitButton);
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        try {
            Thread.sleep(500); // Small wait for smooth scrolling
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", submitButton);
    }

    public boolean isSuccessMessageDisplayed() {
        waitForVisibility(successMessage);
        return successMessage.isDisplayed();
    }
}
