Feature: Support Ticket functionality

  Scenario: Submit a support ticket
    Given I am on the BharatClean support page
    When I enter my name, email, subject, and message
    And I submit the support form
    Then I should see a success message indicating the ticket was submitted
