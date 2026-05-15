Feature: Review System functionality

  Scenario: Rate a completed cleaning session
    Given I am on the BharatClean rating page for a completed booking
    When I select a 5-star rating
    And I enter a comment "Great service!"
    And I submit the review form
    Then I should see a thank you message and be redirected
