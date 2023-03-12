import { useState, useContext } from "react";
import { db } from "../database/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKeydown = e => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Unesite naziv osobe..."
          onKeyDown={handleKeydown}
          onChange={e => setUsername(e.target.value)}
          value={username}
          className="w-full bg-gray-400 placeholder-white h-10 p-3 outline-none"
        />
      </div>
      {err && <span>Korisnik nije pronađen...</span>}
      {user && (
        <div
          onClick={handleSelect}
          className="flex items-center gap-3 p-3 cursor-pointer border-b border-solid border-white hover:bg-gray-500"
        >
          <img
            src={user.photoURL}
            alt="Slika profila"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{user.displayName}</span>
        </div>
      )}
    </div>
  );
};

export default Search;
