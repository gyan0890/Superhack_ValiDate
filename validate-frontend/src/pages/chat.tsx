import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUserData } from "@/components/UserContext";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import LeftHeader from "@/components/Chat/LeftHeader";
import ChatMessages from "@/components/Chat/ChatMessages";
import ValiDateAbi from "../artifacts/ValiDateAbi.json";
import { VALIDATE_ADDRESS } from "@/utils/constants";
import Web3 from "web3";
import {
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

function Chat() {
  const { ownerAddress, safeSelected, chain, web3Provider }: any =
    useAccountAbstraction();
  const web3 = new Web3(web3Provider?.provider);
  const [activeUserProfile, setActiveUserProfile] = useState<any>();
  const [currentChatProfile, setCurrentChatProfile] = useState<any>();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const talkApiId: any = process.env.NEXT_PUBLIC_TALK_APP_ID;

  const valiDateContract: any =
    chain.id && new web3.eth.Contract(ValiDateAbi, VALIDATE_ADDRESS[chain.id]);

  const getActiveProfiledata = async () => {
    const activeProfile = await valiDateContract.methods
      .getProfilePerUser(ownerAddress)
      .call();
    setActiveUserProfile(activeProfile);
  };

  useEffect(() => {
    ownerAddress && getActiveProfiledata();
  }, [ownerAddress]);

  const handleOtherChatUser = async (userId: any) => {
    const currentProfile = await valiDateContract.methods
      .getProfilePerUser(userId)
      .call();
    setCurrentChatProfile(currentProfile);
  };

  const chatboxEl: any = useRef();

  useEffect(() => {
    !ownerAddress && router.push("/");
  }, [ownerAddress]);

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded && activeUserProfile && currentChatProfile) {
      const currentUser = new Talk.User({
        id: activeUserProfile.safeId,
        name:
          currentChatProfile.safeId.slice(0, 4) +
          "..." +
          currentChatProfile.safeId.slice(-4),
        photoUrl: "https://xsgames.co/randomusers/assets/avatars/pixel/16.jpg",
      });

      const otherUser = new Talk.User({
        id: currentChatProfile.safeId,
        name:
          activeUserProfile.safeId.slice(0, 4) +
          "..." +
          activeUserProfile.safeId.slice(-4),
        photoUrl: "https://xsgames.co/randomusers/assets/avatars/pixel/17.jpg",
      });

      const session = new Talk.Session({
        appId: talkApiId,
        me: otherUser,
      });

      const conversationId = Talk.oneOnOneId(otherUser, currentUser);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(otherUser);
      conversation.setParticipant(currentUser);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);

      chatbox.mount(chatboxEl.current);

      return () => session.destroy();
    }
  }, [talkLoaded, activeUserProfile, currentChatProfile]);

  return (
    <>
      <div className="relative isolate mt-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex bg-white min-w-full h-[80vh] sm:border-0 lg:border rounded-3xl w-full">
          {ownerAddress && (
            <div className="relative border-r sm:border-white lg:border-gray-300 w-0 lg:w-[30%] hidden lg:block">
              <LeftHeader />
              <ChatMessages handleOtherChatUser={handleOtherChatUser} />
            </div>
          )}
          <div className="flex flex-col justify-center items-center px-2 space-y-8 lg:hidden">
            <button>
              <UserGroupIcon
                onClick={() => setOpen(!open)}
                className="h-8 w-8 text-black"
              />
            </button>
          </div>
          {open && (
            <>
              {" "}
              {ownerAddress && (
                <div className="relative z-10 border-lborder-gray-300 w-full block lg:hidden">
                  <LeftHeader />
                  <ChatMessages handleOtherChatUser={handleOtherChatUser} />
                </div>
              )}
            </>
          )}
          <div className="w-full lg:w-[70%] lg:grid-cols-2">
            <style jsx>{`
              .chat-container {
                height: 80vh;
                width: 100%;
              }
            `}</style>
            <div
              className="chat-container flex flex-col gap-y-4 justify-center items-center"
              ref={chatboxEl}
            >
              <div>
                <svg
                  width="53"
                  height="72"
                  viewBox="0 0 53 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48.1277 29.5599C47.2859 39.503 43.3116 39.5935 43.3116 39.5935C42.9079 32.1569 39.3277 26.1704 36.813 22.8337C35.7378 21.4066 34.4686 20.132 33.0832 18.9834C24.071 11.5192 28.5154 0 28.5154 0C15.5416 4.33896 16.5233 16.6786 16.5233 16.6786C17.5067 28.3983 11.755 33.4238 11.755 33.4238C8.1775 26.5091 3.54951 26.5503 3.54951 26.5503C5.06283 28.9083 4.47655 31.7084 3.72522 33.6322C2.46463 36.8585 1.13115 39.7876 0.567906 43.0814L0.566531 43.0787C-0.5376 49.2856 0.312419 52.9434 0.312419 52.9434H0.313795C2.12524 65.8818 12.9895 70.5542 18.1064 72C15.0468 70.4013 11.5652 67.3941 10.7977 61.9082H10.7963C10.7963 61.9082 10.6866 61.4342 10.6357 60.5512C10.5752 59.5383 10.5945 57.9835 10.949 55.9932L10.9504 55.9945C11.2444 54.2738 11.8884 52.719 12.549 51.0688C12.648 50.8245 12.7453 50.5775 12.843 50.3278C13.2948 49.1739 13.6462 47.4958 12.7384 46.082C12.7384 46.082 15.5141 46.0567 17.6577 50.2032C17.6577 50.2032 21.1076 47.1893 20.5169 40.1616C20.5169 40.1616 19.9292 32.7622 27.709 30.1613C27.709 30.1613 25.0434 37.068 30.4475 41.5435C31.2783 42.2327 32.0392 42.9973 32.6847 43.8523C34.1925 45.8532 36.3392 49.4432 36.5809 53.9028C36.5809 53.9028 38.9649 53.8483 39.469 47.8857C39.469 47.8857 48.1841 64.6558 35.5098 71.6037C36.735 71.2427 37.9364 70.8072 39.1093 70.2959C63.7234 59.5709 48.128 29.5592 48.128 29.5592L48.1277 29.5599Z"
                    fill="black"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold">Start a New Chat</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
