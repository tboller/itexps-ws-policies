package insurance.policies;

import com.intuit.karate.junit5.Karate;

class PoliciesRunner {

    @Karate.Test
    Karate testPolicies() {
        return Karate.run().relativeTo(getClass());
    }

}