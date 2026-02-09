Feature: GET policies by customer_id

  #1. Status code is 200
  Scenario: Status code is 200
    Given path 'policies'
    When method get
    Then status 200

    #2. Response time is below 100ms
  Scenario: Response time is below 100ms
    Given path 'policies'
    When method get
    Then status 200
    * assert responseTime < 100

    #3. No server errors (not 5xx)
  Scenario: No server errors (not 5xx)
    Given path 'policies'
    When method get
    Then status 200
    * def serverErrors = [500, 502, 503, 504]
    * assert !serverErrors.includes(responseStatus)

    #4. JSON validity
  Scenario: Response is valid JSON
    Given path 'policies'
    When method get
    Then status 200
    And match header Content-Type contains 'application/json'
    And match response != null

    #5. customerId matches requested customer_id
  Scenario: Returned customerId matches requested customerId if available
    * def requestedCustomerId = karate.get('customer_id')
    Given path 'policies'
    When method get
    Then status 200
    * eval
      """
      if (requestedCustomerId) {
        var matches = response.data.filter(p => p.customer_id == requestedCustomerId);
        if (matches.length === 0) {
          karate.fail('No policy found for customer_id=' + requestedCustomerId);
        }
      }
      """
    #6. Only one query parameter allowed
  Scenario: Only one query parameter allowed
    Given path 'policies'
    When method get
    Then status 200
    * def params = request.params
    * def keys = Object.keys(params).filter(k => k != 'page')
    * assert keys.length < 2




