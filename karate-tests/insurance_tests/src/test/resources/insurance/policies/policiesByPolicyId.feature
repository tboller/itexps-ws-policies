Feature: GET policy by policy_id

  Background:
    * url 'http://localhost:3000'
    * def policyId = 23


  # 1. Status code is 200
  Scenario: Status code is 200
    Given path 'policies', policyId
    When method get
    Then status 200


  # 2. Response time is below 100ms
  Scenario: Response time is below 100ms
    Given path 'policies', policyId
    When method get
    Then status 200
    And assert responseTime < 100


  # 3. No server errors (not 5xx)
  Scenario: No server errors
    Given path 'policies', policyId
    When method get
    Then status 200
    And assert responseStatus < 500


  # 4. Response is valid JSON
  Scenario: Response is valid JSON
    Given path 'policies', policyId
    When method get
    Then status 200
    And match header Content-Type contains 'application/json'
    And match response != null


  # 5. Response contains policy_id field
  Scenario: Response contains policy_id
    Given path 'policies', policyId
    When method get
    Then status 200
    And match response.policy_id == '#number'


  # 6. Returned policy_id matches requested policy_id
  Scenario: Returned policy_id matches requested policy_id
    Given path 'policies', policyId
    When method get
    Then status 200
    And match response.policy_id == policyId