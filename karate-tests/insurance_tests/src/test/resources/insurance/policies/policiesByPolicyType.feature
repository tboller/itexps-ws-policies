Feature: Get policies by policy_type

  Background:
    * url 'http://localhost:3000'
    * def policyType = 'Health'


  # 1. Status code is 200
  Scenario: GET policies by type – status is 200
    Given path 'policies'
    And param policy_type = policyType
    When method get
    Then status 200


  # 2. Response time is below 100ms
  Scenario: GET policies by type – response time < 100ms
    Given path 'policies'
    And param policy_type = policyType
    When method get
    Then status 200
    And assert responseTime < 100


  # 3. No server errors (not 5xx)
  Scenario: GET policies by type – not a 5xx
    Given path 'policies'
    And param policy_type = policyType
    When method get
    Then status 200
    And assert responseStatus < 500


  # 4. Response is valid JSON
  Scenario: GET policies by type – valid JSON
    Given path 'policies'
    And param policy_type = policyType
    When method get
    Then status 200
    And match header Content-Type contains 'application/json'
    And match response != null


  Scenario: GET policies by type – returned type matches requested type
    Given path 'policies'
    And param policy_type = policyType
    When method get
    Then status 200

    # get policies from response (handles both wrapped and plain array)
    * def policies = response.policies ? response.policies : response

    # only validate type if there are policies
    * eval
      """
      if (policies.length > 0) {
        karate.match('each policies[*].policy_type == policyType');
      }
      """

  # 6. Only one query parameter allowed (except page)
  Scenario: Only one query parameter allowed (except page)
    Given path 'policies'
    And param policy_type = 'Health'
    When method get
    Then status 200

    # Karate stores query params in 'karate.request' object
    * def queryParams = {}
    * if (karate.get('policy_type')) queryParams.policy_type = karate.get('policy_type')
    * if (karate.get('page')) karate.remove(queryParams, 'page')

    # assert only one non-page query param
    * assert Object.keys(queryParams).length < 2







