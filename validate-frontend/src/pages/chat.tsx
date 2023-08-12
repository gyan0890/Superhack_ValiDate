import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUserData } from "@/components/UserContext";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import LeftHeader from "@/components/Chat/LeftHeader";
import ChatMessages from "@/components/Chat/ChatMessages";

function Chat() {
  const { ownerAddress } = useAccountAbstraction();
  const { ownerUser, activeUser } = useUserData();
  const router = useRouter();
  const talkApiId: any = process.env.NEXT_PUBLIC_TALK_APP_ID

  const chatboxEl: any = useRef();

  useEffect(() => {
    !ownerAddress && router.push("/");
  }, [ownerAddress]);

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded && activeUser) {
      const currentUser = new Talk.User(activeUser);

      const otherUser = new Talk.User(ownerUser);

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
  }, [talkLoaded, activeUser]);

  return (
    <>
      <div className="relative isolate mt-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex min-w-full h-[80vh] sm:border-0 lg:border rounded-3xl w-full">
          {ownerAddress && (
            <div className="relative border-r sm:border-white lg:border-gray-300 w-[30%]">
              <LeftHeader />
              <ChatMessages />
            </div>
          )}
          <div className="w-[70%] lg:grid-cols-2">
            <style jsx>{`
              .chat-container {
                height: 80vh;
                width: 100%;
              }
            `}</style>
            <div className="chat-container" ref={chatboxEl}>
              loading chat...
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
