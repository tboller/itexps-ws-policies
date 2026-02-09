package insurance.coverages;

import com.intuit.karate.junit5.Karate;

class CoveragesRunner {

    @Karate.Test
    Karate testCoverages() {
        return Karate.run("coverages").relativeTo(getClass());
    }

}