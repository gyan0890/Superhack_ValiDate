import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAccountAbstraction } from "./store/accountAbstractionContext";
import Web3 from "web3";
import ValiDateAbi from "../artifacts/ValiDateAbi.json";
import { VALIDATE_ADDRESS } from "@/utils/constants";

const UserData = [
    {
        id: "0xB7734dC0F8EBF3086235cD98df8AEEF44324B69d",
        name: "Tae",
        photoUrl: "V.jpeg",
        welcomeMessage: "Love me again"
    },
    {
        id: "0x0802e7C2073F3cfFdeD2e7A11Bb2417F46476B1d",
        name: "Suga",
        photoUrl: "yooongi.jpeg",
        welcomeMessage: "Stonned"
    },
    {
        id: "0x677DEC030829B12E2839f4B742cE0549198d2EAd",
        name: "Kookie",
        photoUrl: "jk.jpeg",
        welcomeMessage: "Jkass" 
    }
]

type Props = object;
export const UserContext = createContext<any>(null);
const AppContext: React.FC<Props> = ({ children }: any) => {
  const { web3Provider, ownerAddress, chain }: any = useAccountAbstraction();
  const web3: any = new Web3(web3Provider?.provider);
  const [allUser, setAllUser] = useState<any>();
  const [activeComponent, setActiveComponent] = useState();

  const valiDateContract: any = chain.id && new web3.eth.Contract(
    ValiDateAbi,
    VALIDATE_ADDRESS[chain.id]
  );

  const fetUsers = async () => {
    const allUsersData = await valiDateContract.methods.getAllProfiles().call();
    setAllUser(allUsersData)
  };

  useEffect(() => {
    ownerAddress && fetUsers();
  }, [ownerAddress]);

  const handleActiveComponent = (text: any) => {
    setActiveComponent(text)
  }

  return (
    <UserContext.Provider
      value={{
        allUser,
        setAllUser,
        handleActiveComponent,
        activeComponent,
        valiDateContract
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserData = () => useContext(UserContext);

export { AppContext, useUserData };
