import React from "react";
import { useUserData } from "../UserContext";
import { useAccountAbstraction } from "../store/accountAbstractionContext";

const ChatMessages = () => {
  const { ownerAddress } = useAccountAbstraction();
  const { allUser, handleActiveUser } = useUserData()
  const filterUserData = allUser.filter((item: any) => item.id != ownerAddress)
  
  return (
    <div className="absolute top-[80px] w-full bg-white border border-white lg:border-gray-300 rounded-t-3xl">
      {filterUserData.map((item: any, index: any) => {
        return (
          <div key={index}>
            <div 
                onClick={() => handleActiveUser(item?.id)} 
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
                    {item?.name}
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
