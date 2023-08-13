import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import Web3 from "web3";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import ValiDateAbi from "../artifacts/ValiDateAbi.json";
import { VALIDATE_ADDRESS } from "@/utils/constants";
import { useRouter } from "next/router";

function Profile() {
  const { web3Provider, ownerAddress, chain }: any = useAccountAbstraction();
  const router: any = useRouter();
  const web3 = new Web3(web3Provider?.provider);
  const [allUser, setAllUsers] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(allUser.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const [dateExists, setDateExists] = useState<any>();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    !ownerAddress && router.push("/");
  }, [ownerAddress]);

  useEffect(() => {
    setCurrentIndex(allUser.length - 1);
  }, [allUser]);

  const valiDateContract: any =
    chain.id && new web3.eth.Contract(ValiDateAbi, VALIDATE_ADDRESS[chain.id]);

  const fetUsers = async () => {
    const getAllUsers = await valiDateContract.methods.getAllProfiles().call();
    const filterUserId = getAllUsers.filter(
      (item: any) => item !== ownerAddress
    );
    filterUserId.map(async (item: any) => {
      if (!allUser.some((existingItem: any) => existingItem.safeId === item)) {
        const userData: any = await valiDateContract.methods
          .getProfilePerUser(item)
          .call();
        setAllUsers((prevData: any) => [...prevData, userData]);
      }
    });
  };

  useEffect(() => {
    ownerAddress && fetUsers();
  }, [ownerAddress]);

  useEffect(() => {
    //This code is executed in the browser
    console.log(window.innerWidth);
  }, []);

  const childRefs: any = useMemo(
    () =>
      Array(allUser.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val: any) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < allUser.length - 1;

  console.log("currentIndex", currentIndex);

  const canSwipe = currentIndex >= 0;

  console.log("canSwipe", canSwipe);

  // set last direction and decrease current index
  const swiped = (direction: any, nameToDelete: any, index: any) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: any, idx: any) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir: any) => {
    if (canSwipe && currentIndex < allUser.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const handleIfDateExists = async () => {
    const usersData = await valiDateContract.methods
      .getUserChats(ownerAddress)
      .call();
    setDateExists(usersData);
  };

  useEffect(() => {
    ownerAddress && handleIfDateExists();
  }, [ownerAddress, chain]);

  const SaveData = async (userId: any) => {
    const rawTx = (
      nonce: any,
      value: any,
      gasPrice: any,
      ChainData: any,
      fromAddress: any,
      toAddress: any,
      code: any
    ) => {
      return {
        nonce: nonce,
        gasLimit: value,
        gasPrice: gasPrice,
        chainId: ChainData,
        from: fromAddress,
        to: toAddress,
        data: code,
      };
    };

    const gasPrice = await web3.eth?.getGasPrice();
    const privateKey: any = `0x${process.env.NEXT_PUBLIC_PRV_KEY}`;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    try {
      const code = await valiDateContract.methods
        .userChatMapping(userId, ownerAddress)
        .encodeABI();
      const nonce = await web3.eth.getTransactionCount(account.address);
      const nonceData: any = web3.utils.toHex(nonce);
      const value = await web3.eth.estimateGas({
        from: account.address,
        nonce: nonceData,
        to: VALIDATE_ADDRESS[chain.id],
        data: code,
      });

      try {
        const signature: any = await web3.eth.accounts.signTransaction(
          rawTx(
            web3.utils.toHex(nonce),
            value,
            gasPrice,
            420,
            account.address,
            VALIDATE_ADDRESS[chain.id],
            code
          ),
          privateKey
        );
        web3.eth
          .sendSignedTransaction(signature.rawTransaction)
          .on("receipt", (receipt) => {
            console.log("receipt", receipt);
          });
      } catch (error) {
        console.log("transaction error", error);
      }
    } catch {
      console.log("error");
    }
  };

  const handleAddUserChat = async (userId: any) => {
    const estimatedGasPriceFromWeb3 = await web3.eth.getGasPrice();
    const receipt: any = valiDateContract.methods
      .userChatMapping(ownerAddress, userId)
      .send({
        from: ownerAddress,
        gasPrice: estimatedGasPriceFromWeb3,
      })
      .on("transactionHash", async (hash: any) => console.log("hash", hash))
      .on("receipt", function (receipt: any) {
        console.log("receipt", receipt);
        receipt && SaveData(userId);
        handleIfDateExists();
      })
      .on("error", function (error: any) {
        console.log("error", error);
      });
    return receipt;
  };

  const shorter = (str: any) =>
    str?.length > 8 ? str.slice(0, 4) + "..." + str.slice(-4) : str;

  return (
    <div className="pt-40 max-w-7xl">
      <div className="flex justify-center">
        <div className="relative w-[200px] h-[250px] lg:w-[384px] lg:h-[442px]">
          {window &&
            allUser.map((character: any, index: any) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.safeId}
                onSwipe={(dir) => swiped(dir, character.safeId, index)}
                onCardLeftScreen={() => outOfFrame(character.safeId, index)}
              >
                <div className="rounded-2xl bg-red-700 px-8 py-10 w-full h-full">
                  <img
                    className="mx-auto w-20 h-20 lg:h-48 lg:w-48 rounded-full md:h-56 md:w-56"
                    id={character.safeId}
                    src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                    alt=""
                  />
                  <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-white text-center">
                    {shorter(character.safeId)}
                  </h3>
                  <div className="flex justify-between pt-6">
                    <div>
                      <p className="text-base font-normal pb-1">Age</p>
                      <p className="text-sm leading-6 text-white">
                        {character.age.toString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-normal pb-1">Gender</p>
                      <p className="text-sm leading-6 text-white">
                        {character.gender}
                      </p>
                    </div>
                    <div>
                      {dateExists &&
                      dateExists.filter(
                        (item: any) => item === character.safeId
                      ).length ? (
                        <button className="flex flex-col justify-center items-center">
                         <span className="text-base font-normal pb-1">Liked</span>
                          <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="#fff" d="M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566
                            c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566
                            c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418
                            c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0.988,6.981,0
                            c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936
                            C512,137.911,498.388,101.305,474.655,74.503z"/>
                          <path fill="#E35336" d="M160.959,401.243c-36.618-30.304-65.836-62.565-86.845-95.889
                            c-26.529-42.083-39.981-85.961-39.981-130.418c0-37.025,13.612-73.631,37.345-100.433c21.44-24.213,49.775-39.271,81.138-43.443
                            c-5.286-0.786-10.653-1.189-16.082-1.189c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936
                            c0,44.458,13.452,88.335,39.981,130.418c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146
                            c2.203,0.988,4.779,0.988,6.981,0c0.689-0.308,5.586-2.524,13.577-6.588C251.254,463.709,206.371,438.825,160.959,401.243z"/>
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="flex flex-col justify-center items-center"
                          onClick={() => handleAddUserChat(character.safeId)}
                        >
                          <span className="text-base font-normal pb-1">Like</span>
                          <svg fill="#fff" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 471.701 471.701">
                            <g>
                              <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                            </g>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))}
        </div>
      </div>
      <div className="buttons flex justify-center">
        <button
          className={`${!canSwipe ? "bg-[#c3c4d3]" : "!bg-red-700"} hidden lg:block`}
          onClick={() => swipe("left")}
        >
          Swipe left!
        </button>
        <button
          className={`${!canGoBack ? "bg-[#c3c4d3]" : "!bg-red-700"}`}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          className={`${!canSwipe ? "bg-[#c3c4d3]" : "!bg-red-700"} hidden lg:block`}
          onClick={() => swipe("right")}
        >
          Swipe right!
        </button>
      </div>
    </div>
  );
}

export default Profile;
