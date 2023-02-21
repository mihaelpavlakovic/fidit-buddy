import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import {
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const Admin = () => {
  const [docs, setDocs] = useState([]);
  let userUid = localStorage.getItem("uid");

  const handleSetRole = async uid => {
    const getUserDoc = doc(db, "users", uid);
    await updateDoc(getUserDoc, {
      studentMentor: true,
    })
      .then(() => alert("Korisniku je uspjesno dodana uloga student-mentora."))
      .catch(err => console.log(err));
  };

  const handleRemoveRole = async uid => {
    const getUserDoc = doc(db, "users", uid);
    await updateDoc(getUserDoc, {
      studentMentor: false,
    })
      .then(() => alert("Korisniku je uspjesno oduzeta uloga student-mentora."))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const collRef = collection(db, "users");
    const q = query(collRef, where("uid", "!=", userUid));
    const unsub = onSnapshot(q, snap => {
      let documents = [];
      snap.forEach(doc => {
        documents.push({ ...doc.data() });
      });
      setDocs(documents);
    });
    return () => unsub();
  }, [userUid]);

  const UserList = ({ userData }) => {
    return (
      <li>
        <h2>
          {userData.displayName}{" "}
          <span>{userData.studentMentor && "Student-mentor"}</span>
        </h2>
        <p>{userData.email}</p>
        <p>{userData.jmbag}</p>
        {userData.studentMentor ? (
          <button
            onClick={() => handleRemoveRole(userData.uid)}
            className="bg-red-500 text-sm text-white p-3 rounded-lg hover:bg-red-600"
          >
            Ukloni student-mentora
          </button>
        ) : (
          <button
            onClick={() => handleSetRole(userData.uid)}
            className="bg-teal-500 text-sm text-white p-3 rounded-lg hover:bg-teal-600"
          >
            Postavi za student-mentora
          </button>
        )}
      </li>
    );
  };

  return (
    <div>
      <Navigation />
      <div className="w-5/6 mx-auto">
        <h1 className="text-3xl mt-5 font-semibold">
          Svi korisnici unutar aplikacije:
        </h1>
        <ul>
          {docs.lenght === 0 ? (
            <p className="mt-5">Trenutačno nema kreiranih korisnika.</p>
          ) : (
            docs.map((item, index) => {
              return <UserList key={index} userData={item} />;
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
