import React, { useEffect, useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Web3 from "web3";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import ValiDateAbi from "../artifacts/ValiDateAbi.json";
import { useRouter } from "next/router";
import Document from "./_document";
import { VALIDATE_ADDRESS } from "@/utils/constants";
const snarkjs = require("snarkjs");

function Verify() {
  const { web3Provider, ownerAddress, safeSelected, chain }: any = useAccountAbstraction();
  const router: any = useRouter();
  const [worlIdProof, setWorlIdProof] = useState<any>();
  const [userAge, setUserAge] = useState<any>();
  const [userGender, setUserGender] = useState<any>();
  const [userIntrest, setUserIntrest] = useState<any>();
  const [userName, setUserName] = useState<any>();
  const [userVerification, setUserVerification] = useState<boolean>(false);
  const [uploadFileContent, setUploadFileContent] = useState(null);
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [verfiyLoding, setVerifyLoding] = useState(false);
  const web3 = new Web3(web3Provider?.provider);
  const worlId: any = process.env.NEXT_PUBLIC_WORLD_COIN_ID;

  const valiDateContract: any = chain.id && new web3.eth.Contract(
    ValiDateAbi,
    VALIDATE_ADDRESS[chain.id]
  );

  useEffect(() => {
    !ownerAddress && router.push("/");
  }, [ownerAddress]);

  const fetUsers = async () => {
    const getAllUsers = await valiDateContract.methods.getAllProfiles().call();
    const ifUserExists = getAllUsers.filter(
      (item: any) => item === ownerAddress
    );
    ifUserExists.length && router.push("/chat", null, { shallow: true });
  };

  useEffect(() => {
    ownerAddress && fetUsers();
  }, [ownerAddress]);

  const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _proofInput,
      _wasm,
      _zkey
    );
    return { proof, publicSignals };
  };

  const verifyProof = async (
    _verificationkey: string,
    signals: any,
    proof: any
  ) => {
    const vkey = await fetch(_verificationkey).then(function (res) {
      return res.json();
    });

    const res = await snarkjs.groth16.verify(vkey, signals, proof);
    setVerifyLoding(false);
    if (res === true) {
      setUserVerification(true);
      return "Verification OK";
    } else {
      setUserVerification(false);
      return "Invalid proof";
    }
  };

  async function zkProofCall() {
    setVerifyLoding(true);
    makeProof(
      { age: 32, ageLimit: 32 },
      "/zkProof/ageCheck.wasm",
      "/zkProof/ageCheck_0001.zkey"
    ).then(({ proof: _proof, publicSignals: _signals }) => {
      setProof(JSON.stringify(_proof, null, 2));
      setSignals(JSON.stringify(_signals, null, 2));
      verifyProof("/zkProof/verification_key.json", _signals, _proof).then(
        (_isValid: any) => {
          setIsValid(_isValid);
        }
      );
    });
  }

  const handleCreateProfile = async () => {
    const estimatedGasPriceFromWeb3 = await web3.eth.getGasPrice();
    const receipt: any = valiDateContract.methods
      .createProfile(
        ownerAddress,
        userGender,
        userVerification,
        userAge,
        userVerification,
        userIntrest
      )
      .send({
        from: ownerAddress,
        gasPrice: estimatedGasPriceFromWeb3,
      })
      .on("transactionHash", async (hash: any) => console.log("hash", hash))
      .on("receipt", function (receipt: any) {
        router.push("/chat", null, { shallow: true });
        console.log("receipt", receipt);
      })
      .on("error", function (error: any) {
        console.log("error", error);
      });
    return receipt;
  };

  const getUserChoice = (userId: any) => {
    const choice = userId;
    return choice;
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setUploadFileContent(file);
    file && zkProofCall();
  };

  return (
    <div className="relative bg-white isolate mt-32 max-w-xl mx-auto border border-gray-300 shadow-xl rounded-xl">
      <div className="space-y-12 p-6">
        <div className="pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create Dating Profile
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <p className="text-red-500 text-[8px]">Required *</p>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Verify Identity
              </label>
              <p className="text-red-500 text-[8px]">Required *</p>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <IDKitWidget
                    app_id={worlId}
                    action={getUserChoice("hey")}
                    onSuccess={() => setWorlIdProof("Verified as human")}
                  >
                    {({ open }) => (
                      <button
                        onClick={open}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      >
                        {!worlIdProof
                          ? "Verify you are human"
                          : "✅ Verified Sucessfully"}
                      </button>
                    )}
                  </IDKitWidget>
                  {/* <IDKitWidget
                    app_id={worlId} // obtained from the Developer Portal
                    action="vote_1" // this is your action name from the Developer Portal
                    onSuccess={setProof} // callback when the modal is closed
                    // handleVerify={handleVerify} // optional callback when the is received
                    // credential_types={['orb', 'phone']} // optional, defaults to ['orb']
                    enableTelemetry // optional, defaults to false
                  >
                    {({ open }) => <button onClick={open} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                      Verify you are human
                    </button>}
                  </IDKitWidget> */}
                </div>
              </div>
              <div className="flex justify-between items-center gap-x-8 sm:col-span-6 pt-8">
                <div className="w-[48%]">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Enter your age
                  </label>
                  <p className="text-red-500 text-[8px]">
                    (according to document) Required *
                  </p>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        onChange={(e) => {
                          setUserAge(e.target.value);
                        }}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-[48%]">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter your gender
                  </label>
                  <p className="text-red-500 text-[8px]">
                    (according to document) Required *
                  </p>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="gender"
                        id="gender"
                        onChange={(e) => {
                          setUserGender(e.target.value);
                        }}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full pt-4">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload Document to verify age and gender
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-4">
                {uploadFileContent ? (
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600"
                  >
                    Uploded Succesfully
                    <span className="block text-green-700 text-base front-normal">
                      {verfiyLoding
                        ? "Documnet Verfiying......"
                        : "Document Verified"}
                    </span>
                  </label>
                ) : (
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-[#65C0D0]"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          onChange={handleFileChange}
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full pt-4">
              <label
                htmlFor="intrest"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Write a few sentences about yourself and Intrest
              </label>
              <p className="text-red-500 text-[8px]">Required *</p>
              <div className="mt-2">
                <textarea
                  onChange={(e) => {
                    setUserIntrest(e.target.value);
                  }}
                  id="intrest"
                  name="intrest"
                  rows={3}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6 px-6 pb-6">
        <button
          disabled={
            !userGender || !userAge || !userIntrest || !userName || !worlIdProof
          }
          onClick={() => handleCreateProfile()}
          className="w-[200px] bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-full disabled:cursor-not-allowed disabled:opacity-25"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
}

export default Verify;
