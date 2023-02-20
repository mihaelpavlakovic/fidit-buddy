import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { IoIosAttach } from "react-icons/io";
import { RiImageAddLine } from "react-icons/ri";
import { FiSend } from "react-icons/fi";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        error => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="h-10 bg-white flex items-center justify-between">
      <input
        type="text"
        onChange={e => setText(e.target.value)}
        value={text}
        placeholder="Vaša poruka..."
        className="w-full h-full p-3 outline-none"
      />
      <div className="flex items-center gap-2">
        <IoIosAttach className="cursor-pointer" />
        <input
          type="file"
          id="file"
          onChange={e => setImg(e.target.files[0])}
          className="hidden"
        />
        <label htmlFor="file">
          <RiImageAddLine className="cursor-pointer" />
        </label>
        <button
          onClick={handleSend}
          className="bg-teal-500 text-white p-3 hover:bg-teal-400"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Input;
