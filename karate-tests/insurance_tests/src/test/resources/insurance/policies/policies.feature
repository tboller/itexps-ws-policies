Feature: GET all policies tests

  Background:
    * url 'http://localhost:3000/policies'

  # 1. Status is 200
  Scenario: GET all policies – status is 200
    Given url 'http://localhost:3000/policies'
    When method get
    Then status 200

#2. Responce time
  Scenario: Response time is fast
    Given url 'http://localhost:3000/policies'
    When method get
    * eval
      """
      if (responseTime >= 1000) karate.fail('Response time is too high: ' + responseTime)
      """

  # 3. No server errors
  Scenario: GET all policies – not a 5xx
    Given url 'http://localhost:3000/policies'
    When method get
    * match responseStatus != 500
    * match responseStatus != 502
    * match responseStatus != 503
    * match responseStatus != 504


  # 4. Each policy has required fields
  Scenario: GET all policies – each policy has minimum required fields
    Given url 'http://localhost:3000/policies'
    When method get
    * def policies = response.data
    * match policies == '#[]'
    * eval
      """
      policies.forEach(function(p, i){
        if (!p.hasOwnProperty('customer_id')) karate.fail('policy[' + i + '] missing customer_id');
        if (!p.hasOwnProperty('policy_type')) karate.fail('policy[' + i + '] missing policy_type');
        if (!p.hasOwnProperty('start_date')) karate.fail('policy[' + i + '] missing start_date');
        if (!p.hasOwnProperty('end_date')) karate.fail('policy[' + i + '] missing end_date');
        if (!p.hasOwnProperty('status')) karate.fail('policy[' + i + '] missing status');
      });
      """


    # 5. Response contains at least one policy with status EXPIRED
    * def expired = response.data.filter(x => x.status == 'EXPIRED')
    * assert expired.length > 0

  # 6. Policy status has allowed values
  Scenario: GET all policies – policy status has allowed values
    Given url 'http://localhost:3000/policies'
    When method get
    Then status 200

    * def allowed = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING']
    * match response.data[*].status contains only allowed

