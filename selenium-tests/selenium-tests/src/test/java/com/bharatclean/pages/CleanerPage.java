package com.bharatclean.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import java.util.List;

public class CleanerPage extends BasePage {

    @FindBy(xpath = "//h1[contains(text(), 'Cleaner Portal')]")
    private WebElement portalHeader;

    @FindBy(xpath = "//button[contains(text(), 'Mark as Completed')]")
    private List<WebElement> completeButtons;

    @FindBy(xpath = "//div[contains(text(), 'COMPLETED')]")
    private List<WebElement> completedStatusLabels;

    @FindBy(xpath = "//h2[contains(text(), 'Job History')]")
    private WebElement jobHistoryHeader;

    public CleanerPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPortalHeaderDisplayed() {
        waitForVisibility(portalHeader);
        return portalHeader.isDisplayed();
    }

    public void markFirstJobAsCompleted() {
        if (!completeButtons.isEmpty()) {
            click(completeButtons.get(0));
        } else {
            throw new RuntimeException("No jobs found to mark as completed");
        }
    }

    public int getCompletedJobCount() {
        return completedStatusLabels.size();
    }
}
