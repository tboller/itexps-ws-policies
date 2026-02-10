Feature: GET all policies API tests

  Background:
    # Base URL of your API
    * url 'http://localhost:3000'
    
  #0. 
  	Scenario: GET all policies – check content-type
    Given path 'policies'
    When method get
    Then status 200
    And match responseHeaders['Content-Type'][0] contains 'application/json'

  # 1. Status & response time
  Scenario: GET all policies – status is 200
    Given path 'policies'
    When method get
    Then status 200
    * assert responseTime < 300

  # 2. No server errors
  Scenario: GET all policies – not a 5xx
    Given path 'policies'
    When method get
    Then status 200
    * def serverErrors = [500, 502, 503, 504]
    * assert !serverErrors.includes(responseStatus)

  # 3. JSON validity
  Scenario: GET all policies – valid JSON
    Given path 'policies'
    When method get
    * assert response != null
    * assert response.data != null


  # 4. Shape / required fields
  Scenario: GET all policies – each policy has minimum required fields
    Given path 'policies'
    When method get
    Then match response.data[*].customer_id != null
    And match response.data[*].policy_type != null
    And match response.data[*].start_date != null
    And match response.data[*].end_date != null
    And match response.data[*].status != null

  # 5. Response contains policies with status EXPIRED
	Scenario: Response contains policies with status EXPIRED
    Given path 'policies'
    When method get
    Then status 200
    * def hasExpired = response.data.filter(p => p.status == 'EXPIRED')
    * assert hasExpired.length > 0

  # 6. Policy status has allowed values
  Scenario: Policy status has allowed values
    * def allowed = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING']
    Given path 'policies'
    When method get
    Then match each response.data == '#? allowed.includes(_.status)'

  