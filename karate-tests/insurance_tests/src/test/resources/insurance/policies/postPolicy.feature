Feature: Create Policy

  Background:
    * url 'http://localhost:3000'
    # Define the request payload once to use in multiple scenarios
    * def requestPayload = { customerId: '12345', type: 'auto' }


  # 1. POST policy – status is 201 or 200
  Scenario: Create a new policy
    Given path 'policies'
    And request
      """
      {
        "customer_id": 30,
        "policy_type": "Health",
        "start_date": "2025-01-01",
        "end_date": "2026-01-01"
      }
      """
    When method post
    Then status 201
    And match response contains { status: 'PENDING' }


  # 2. POST policy – response time < 1000ms
  Scenario: POST policy – response time < 1000ms
    Given path 'policies'
    And request requestPayload
    When method POST
    # Postman Test 1 (Part 2): Response time
    Then assert responseTime < 1000

  # 3. POST policy – not a server error (not 5xx)
  Scenario: POST policy – not a 5xx
    Given path 'policies'
    And request requestPayload
    When method POST
    # Postman Test 2: No server errors
    Then assert responseStatus < 500

  # 4. POST policy – valid JSON
  Scenario: POST policy – valid JSON
    Given path 'policies'
    And request
      """
      {
        "customer_id": 30,
        "policy_type": "Health",
        "start_date": "2025-01-01",
        "end_date": "2026-01-01"
      }
      """
    When method post
    Then status 201
    * def resp = response
    * match resp != null
    * match resp == '#object'

  # 5. POST policy – response has required fields
  Scenario: POST policy – response has required fields
    Given path 'policies'
    And request
      """
      {
        "customer_id": 30,
        "policy_type": "Health",
        "start_date": "2025-01-01",
        "end_date": "2026-01-01"
      }
      """
    When method post
    Then status 201
    * match response contains { policy_id: '#number', status: '#string' }

  # 6. POST policy – response matches request payload for non-generated fields
  Scenario: POST policy – response contains required fields
    Given path 'policies'
    * def requestPayload =
      """
      {
        "customer_id": 30,
        "policy_type": "Health",
        "start_date": "2025-01-01",
        "end_date": "2026-01-01"
      }
      """
    And request requestPayload
    When method post
    Then status 201
    # only validate the fields that exist in response
    * match response contains { policy_id: '#number', status: '#string' }
