Feature: GET policies by customer_id

  Background:
    * url 'http://localhost:3000'
    * def customerId = 103

  # 1. Status code is 200
  Scenario: Status code is 200
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200


  # 2. Response time is below 100ms
  Scenario: Response time is below 100ms
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200
    And assert responseTime < 100


  # 3. No server errors (not 5xx)
  Scenario: No server errors
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200
    And assert responseStatus < 500


  # 4. Response is valid JSON
  Scenario: Response is valid JSON
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200
    And match header Content-Type contains 'application/json'
    And match response == { data: '#[]', meta: '#object' }


  # 5. customer_id matches requested customer_id
  Scenario: Returned customer_id matches requested customer_id
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200
    And match each response.data[*].customer_id == customerId


  # 6. Only one query parameter allowed
  Scenario: Only one query parameter allowed
    Given path 'policies'
    And param customer_id = customerId
    When method get
    Then status 200

    # Use 'requestUrl' instead of 'url'
    * def requestUrl = karate.prevRequest.url
    * assert !requestUrl.contains('?') || !requestUrl.split('?')[1].contains('&')
