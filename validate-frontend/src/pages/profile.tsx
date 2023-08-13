import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import Web3 from "web3";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import ValiDateAbi from "../artifacts/ValiDateAbi.json";
import { VALIDATE_ADDRESS } from "@/utils/constants";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const DatingCard = dynamic(() => import("../components/DatingCard"), {
  ssr: false,
});

function Profile() {
  const { web3Provider, ownerAddress, chain }: any = useAccountAbstraction();
  const router: any = useRouter();
  const web3 = new Web3(web3Provider?.provider);
  const [allUser, setAllUsers] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(allUser.length - 1);
  const [dateExists, setDateExists] = useState<any>();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Your code that uses the window object
    }
  }, []);

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

  const handleIfDateExists = async () => {
    const usersData = await valiDateContract.methods
      .getUserChats(ownerAddress)
      .call();
    setDateExists(usersData);
  };

  useEffect(() => {
    ownerAddress && handleIfDateExists();
  }, [ownerAddress, chain]);

  return (
    <div className="pt-40 max-w-7xl">
      <div className="flex justify-center">
        <DatingCard />
      </div>
    </div>
  );
}

export default Profile;
