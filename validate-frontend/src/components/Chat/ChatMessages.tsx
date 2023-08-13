import React, { useEffect, useState } from "react";
import { useUserData } from "../UserContext";
import { useAccountAbstraction } from "../store/accountAbstractionContext";
import ValiDateAbi from "../../artifacts/ValiDateAbi.json";
import Web3 from "web3";
import { VALIDATE_ADDRESS } from "@/utils/constants";

const ChatMessages = ({handleOtherChatUser}: any) => {
  const { ownerAddress, chain, safeSelected, web3Provider }: any = useAccountAbstraction();
  const web3 = new Web3(web3Provider?.provider);
  const [ userActiveChats, setUserActiiveChats ] = useState<any>()
  const [ userAccountDetails, setUserAccountDetails ] = useState<any>([]);

  const valiDateContract: any = chain.id && new web3.eth.Contract(
    ValiDateAbi,
    VALIDATE_ADDRESS[chain.id]
  );

  const handlegetAllChatIds = async () => {
    const userChatIds = await valiDateContract.methods.getUserChats(ownerAddress).call();    
    const data = userChatIds.map(async (item: any) => {
      if (!userAccountDetails.some((existingItem: any) => existingItem.safeId === item)) {
        const userData: any = await valiDateContract.methods.getProfilePerUser(item).call()
        setUserAccountDetails((prevData: any) => [...prevData, userData])
        return userData
      }
    })
    setUserActiiveChats(userChatIds)
  };

  useEffect(() => {
    handlegetAllChatIds()
  }, [ownerAddress, chain])

 const shorter = (str: any) =>
  str?.length > 8 ? str.slice(0, 4) + "..." + str.slice(-4) : str;
  
  return (
    <div className="absolute top-[80px] w-full bg-white border border-white lg:border-gray-300 rounded-t-3xl">
      {userAccountDetails.map((item: any, index: any) => {
        return (
          <div key={index}>
            <div 
                onClick={() => handleOtherChatUser(item?.safeId)} 
                className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
            >
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
                alt="username"
              />
              <div className="w-full pb-2">
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold text-gray-600">
                    {shorter(item?.safeId)}
                  </span>
                  {/* <span className="block ml-2 text-sm text-gray-600">
                    {item.time}
                  </span> */}
                </div>
                <span className="block ml-2 text-sm text-gray-600">
                  {item?.welcomeMessage}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
