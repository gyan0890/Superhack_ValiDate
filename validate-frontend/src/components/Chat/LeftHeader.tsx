import React from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const LeftHeader = () => {
  return (
    <>
      <div className="relative bg-ohji-lightBlue h-[20%]">
        <div className="flex flex-row justify-between items-center px-4 pt-4">
          <div>
            <img
              className="object-cover w-10 h-10 rounded-full"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzB8fGh1bWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80"
              alt="username"
            />
          </div>
          <div className="inline-flex space-x-4">
            <UserGroupIcon className="h-6 w-6 text-white" />
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-white" />
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftHeader;
