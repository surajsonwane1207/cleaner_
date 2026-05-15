package com.bharatclean.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class BookingPage extends BasePage {

    @FindBy(id = "date")
    private WebElement dateInput;

    @FindBy(id = "time")
    private WebElement timeInput;

    @FindBy(id = "address")
    private WebElement addressInput;

    @FindBy(id = "notes")
    private WebElement notesInput;

    @FindBy(xpath = "//button[@type='submit']")
    private WebElement confirmButton;

    public BookingPage(WebDriver driver) {
        super(driver);
    }

    public void fillBookingDetails(String date, String time, String address, String notes) {
        // Use Javascript to set date and time to avoid format issues with sendKeys
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].value = arguments[1];", dateInput, date);
        js.executeScript("arguments[0].value = arguments[1];", timeInput, time);
        
        writeText(addressInput, address);
        writeText(notesInput, notes);
        click(confirmButton);
    }
}
