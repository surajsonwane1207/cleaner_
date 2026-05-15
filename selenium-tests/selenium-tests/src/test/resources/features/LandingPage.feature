Feature: Landing Page functionality

  Scenario: Verify landing page title and hero text
    Given I am on the BharatClean landing page
    Then I should see the title containing "BharatClean"
    And I should see the hero text "Professional Cleaning"
