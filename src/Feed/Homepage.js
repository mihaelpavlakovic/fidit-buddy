import Navigation from "../Navigation";
import Post from "./Post";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [docs, setDocs] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
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
      <main className="xl:max-w-7xl xl:mx-auto max-w-full px-[8%]">
        <div className="flex flex-col">
          <h1 className="text-3xl mt-5 font-semibold">
            Dobro došli {currentUser.displayName}! 👋
          </h1>
          {docs.lenght === 0 ? (
            <p className="mt-5">
              Trenutačno nema objava. Kreirajte prvu objavu{" "}
              <Link
                to="/kreiraj-objavu"
                className="text-teal-500 hover:underline"
              >
                ovdje
              </Link>
              .
            </p>
          ) : (
            docs.map(item => {
              return <Post key={item.docId} postDetail={item} />;
            })
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
