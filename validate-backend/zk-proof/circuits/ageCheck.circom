pragma circom 2.0.0; 


include "comparators.circom";

template AgeLimit() {
    // private
    signal input age; 
    
    // public
    signal input ageLimit;


    // true/false
    signal output out;

    // considering max age 127
    component equalTo = IsEqual(); 
    equalTo.in[0] <== age;
    equalTo.in[1] <== ageLimit;

    out <-- equalTo.out;
    out === 1;
}

component main {public [ageLimit]} = AgeLimit();