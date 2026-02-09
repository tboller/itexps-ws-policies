package insurance.policies;

import com.intuit.karate.junit5.Karate;

class ClaimsRunner {

    @Karate.Test
    Karate testClaims() {
        return Karate.run("claims").relativeTo(getClass());
    }

}