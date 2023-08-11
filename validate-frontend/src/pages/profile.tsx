import { useUserData } from "@/components/UserContext";
import React from "react";
import Chat from '../components/Chat';
import VerifyUser from "../components/VerifyUser";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";

const Profile = () => {
  const { ownerAddress } = useAccountAbstraction();
  const { activeComponent, allUser } = useUserData();

  const userExists = allUser.filter((item: { id: string | undefined; }) => item.id === ownerAddress) 
  
  return (
    <div>
        {activeComponent == "chat" || userExists.length ? <Chat/> : <VerifyUser/>}
    </div>
  );
}

export default Profile;
