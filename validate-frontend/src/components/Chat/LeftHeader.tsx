import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const LeftHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <div className="relative bg-ohji-lightBlue h-[20%]">
        <div className="flex flex-row justify-between items-center px-4 pt-4">
          <div>
            <img
              className="object-cover w-10 h-10 rounded-full"
              src="https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg"
              alt="username"
            />
          </div>
        
          {/* <div className="inline-flex space-x-4">
            <button>
              <UserGroupIcon className="h-6 w-6 text-black" />
            </button>
            <button>
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-black" />
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LeftHeader;
