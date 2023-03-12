// react imports
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// component imports
import Navigation from "../components/Navigation";
import MessagesPageSec from "./MessagesPageSec";

// firebase imports
import { db } from "../database/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// library imports
import ReactSelect from "react-select";
import { AuthContext } from "../context/AuthContext";

const ChatPage = () => {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [lastChats, setLastChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState();

  const handleSelect = e => {
    if (e != null) {
      const existingChat = lastChats.find(x => x.interlocutorUid === e.value);
      if (existingChat) {
        e.messagesUid = existingChat.messagesUid;
        e.lastChatUid = existingChat.id;
      }
      let w = window.innerWidth;
      if (w >= 768) {
        setSelectedUser(e);
        setSelectedOption(null);
      } else {
        navigate("/messages", {
          state: e,
        });
      }
    }
  };

  const handleSelectExisting = chat => {
    let w = window.innerWidth;
    const chatData = {
      value: chat.interlocutorUid,
      label: chat.senderName,
      image: chat.senderPhoto,
      messagesUid: chat.messagesUid,
      lastChatUid: chat.id,
    };

    if (w >= 768) {
      setSelectedUser(chatData);
    } else {
      navigate("/messages", {
        state: chatData,
      });
    }
  };

  useEffect(() => {
    const userCollRef = collection(db, "users");

    const unsub = onSnapshot(userCollRef, snap => {
      const userDocs = [];
      snap.forEach(doc => {
        userDocs.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userDocs);
    });

    return unsub;
  }, []);

  useEffect(() => {
    const getChats = () => {
      const lastChatsRef = collection(
        db,
        "users",
        currentUser.uid,
        "lastChats"
      );
      const unsub = onSnapshot(lastChatsRef, snap => {
        const lastChatsDocs = [];
        snap.forEach(doc => {
          const userData = users.find(
            x => x.uid === doc.data().interlocutorUid
          );
          const senderPhoto = userData?.photoURL;
          const senderName = userData?.displayName;
          lastChatsDocs.push({
            id: doc.id,
            senderPhoto: senderPhoto,
            senderName: senderName,
            ...doc.data(),
          });
        });
        setLastChats(lastChatsDocs);
      });

      return unsub;
    };

    currentUser.uid && getChats();
  });

  const formatOptionLabel = ({ value, label, image }) => (
    <div className="flex items-center">
      <div className="h-10 w-10">
        <img className="h-10 w-10 rounded-md" src={image} alt="Slika profila" />
      </div>
      <div className="ml-4">
        <div className="font-semibold">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col absolute inset-0">
      <Navigation />
      <main className="md:flex justify-center h-ful">
        <div className="md:flex md:w-full lg:w-4/5 xl:w-2/3 2xl:w-3/5 md:border-x-2">
          <div className="flex flex-col md:w-3/5 md:border-r-2">
            <h1 className="text-3xl mx-6 mt-4 font-bold md:my-4">Razgovori</h1>
            <ReactSelect
              className="mx-6 my-2"
              value={selectedOption}
              onChange={handleSelect}
              placeholder={"Pretraži korisnike..."}
              formatOptionLabel={formatOptionLabel}
              options={users.map(user => {
                return {
                  value: user.uid,
                  label: user.displayName,
                  image: user.photoURL,
                };
              })}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#14b8a6",
                  primary25: "#ccfbf1",
                },
              })}
              styles={{
                control: base => ({
                  ...base,
                  borderRadius: 6,
                }),
              }}
            />

            {(lastChats.length > 0 &&
              lastChats.map(chat => {
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectExisting(chat)}
                    className="flex items-center px-6 py-3 hover:bg-gray-100 hover:md:bg-teal-100 transition cursor-pointer"
                  >
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-md"
                        src={chat.senderPhoto}
                        alt="Slika profila"
                      />
                    </div>
                    <div className="flex flex-col ml-4 w-full overflow-hidden">
                      <div className="flex grow justify-between">
                        <div className="font-semibold">{chat.senderName}</div>
                        <div className="text-xs text-gray-500 text-right">
                          {chat.received.toDate().toLocaleString("hr-HR", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              })) || <div className="flex justify-center m-4">Nema poruka</div>}
          </div>

          <div className="hidden md:flex w-full">
            <MessagesPageSec
              interlocutorUid={selectedUser?.value}
              senderName={selectedUser?.label}
              senderPhoto={selectedUser?.image}
              messagesUid={selectedUser?.messagesUid}
              lastChatUid={selectedUser?.lastChatUid}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
