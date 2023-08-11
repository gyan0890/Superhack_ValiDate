const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({"age": 32, "ageLimit": 32}, "./circuits/ageCheck_js/ageCheck.wasm", "../ageCheck_0001.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));
    console.log("Public signals:");
    console.log(publicSignals);
    const vKey = JSON.parse(fs.readFileSync("../verification_key.json"));
    console.log("Verification Key:");
    console.log(vKey);
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

}

run().then(() => {
    process.exit(0);
});

