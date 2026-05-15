package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SubscribePage extends BasePage {

    @FindBy(xpath = "//button[contains(text(), 'Pay ₹')]")
    private WebElement payButton;

    @FindBy(xpath = "//button[text()='Simulate Success']")
    private WebElement simulateSuccessButton;

    public SubscribePage(WebDriver driver) {
        super(driver);
    }

    public void clickPay() {
        click(payButton);
    }

    public void clickSimulateSuccess() {
        click(simulateSuccessButton);
    }
}
