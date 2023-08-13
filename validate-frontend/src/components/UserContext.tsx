import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAccountAbstraction } from "./store/accountAbstractionContext";

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
  const { ownerAddress } = useAccountAbstraction();
  const [allUser, setAllUser] = useState(UserData);
  const [ownerUser, setOwnweUser] = useState<any>();
  const [activeUser, setActiveUser] = useState<any>();
  const [activeComponent, setActiveComponent] = useState();

  useEffect(() => {
    const data = UserData.filter(item => item.id === ownerAddress)
    setOwnweUser(data[0])
  }, [ownerAddress])

  const handleActiveUser = (address: any) => {    
    const data = UserData.filter(item => item.id === address)
    setActiveUser(data[0])
  }

  const handleActiveComponent = (text: any) => {
    setActiveComponent(text)
  }

  return (
    <UserContext.Provider
      value={{
        allUser,
        setAllUser,
        ownerUser,
        setOwnweUser,
        handleActiveUser,
        activeUser,
        handleActiveComponent,
        activeComponent
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserData = () => useContext(UserContext);

export { AppContext, useUserData };
