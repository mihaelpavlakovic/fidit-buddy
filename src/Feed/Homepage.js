import Navigation from "../Navigation";
import Post from "./Post";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const Homepage = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const collRef = collection(db, "posts");
    const q = query(
      collRef,
      orderBy("createdDate", "desc"),
      orderBy("createdTime", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      let documents = [];
      snap.forEach(doc => {
        documents.push({ ...doc.data(), docId: doc.id });
      });
      setDocs(documents);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Navigation />
      <main className="md:w-5/6 mx-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl mt-5 font-semibold">
            Dobro došli studenti! 👋
          </h1>
          {!docs
            ? "Nema kreiranih objava"
            : docs.map(item => {
                return <Post key={item.docId} postDetail={item} />;
              })}
        </div>
      </main>
    </>
  );
};

export default Homepage;
