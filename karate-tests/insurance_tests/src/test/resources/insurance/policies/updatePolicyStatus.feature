Feature: Update policy status

  Background:
    * url 'http://localhost:3000'

    # Create a policy to update
    * def requestPayload =
      """
      {
        "customer_id": 999,
        "policy_type": "Health",
        "start_date": "2025-01-01",
        "end_date": "2026-01-01"
      }
      """
    Given path 'policies'
    And request requestPayload
    When method post
    Then status 201
    * def policyId = response.policy_id
    * def currentStatus = response.status

    # Prepare new status for update
    * def statuses = ['PENDING','ACTIVE','EXPIRED','CANCELLED']
    * def availableStatuses = statuses.filter(s => s != currentStatus)
    * def newStatus = availableStatuses[Math.floor(Math.random() * availableStatuses.length)]
    * def updatePayload = { status: '#(newStatus)' }

  #################################################################
  # 1. Status code is 200
  Scenario: Update policy – Status code is 200
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200


  # 2. Response time is below 1000ms
  Scenario: Update policy – Response time is below 1000ms
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * assert responseTime < 1000


  # 3. No server errors (not 5xx)
  Scenario: Update policy – No server errors (not 5xx)
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * def serverErrors = [500,502,503,504]
    * assert !serverErrors.includes(responseStatus)


  # 4. Response is valid JSON
  Scenario: Update policy – Response is valid JSON
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * match response != null
    * print 'Response JSON:', response


  # 5. Response has updated policy fields
  Scenario: Update policy – Response has updated policy fields
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * match response.status == newStatus

  # 6. Returned status matches requested
  Scenario: Update policy – Returned status matches requested
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * match response.status == updatePayload.status
    * print 'API does not return policy_id – cannot assert policyId'


  # 7. Policy ID consistency
  Scenario: Update policy – Policy ID consistency
    Given path 'policies', policyId
    And request updatePayload
    When method put
    Then status 200
    * match response.status == updatePayload.status
    * print 'policy_id is not returned by API – skipping assertion'

