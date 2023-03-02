import Navigation from "../Navigation";
import Post from "./Post";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  doc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { currentUser } = useContext(AuthContext);
  let userId = localStorage.getItem("uid");
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);

  const onDelete = async (comIndex, docId) => {
    const docRef = doc(db, "posts", docId);
    const docForDelete = await getDoc(docRef).then(doc => doc.data());

    await updateDoc(docRef, {
      comments: arrayRemove(docForDelete.comments[comIndex]),
    })
      .then(() => {
        alert("Komentar je uspjesno obrisan.");
      })
      .catch(error => {
        console.log(error);
      });
  };

  const userData = useCallback(async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    const data = docSnap.exists() ? setUser(docSnap.data()) : null;

    if (data === null || data === undefined) return null;
  }, [userId]);

  useEffect(() => {
    userData();
  }, [userData]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      orderBy("createdDate", "asc"),
      orderBy("createdTime", "desc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const updatedPosts = [];
      snapshot.forEach(doc => {
        const postData = doc.data();
        const post = { docId: doc.id, ...postData };

        if (postData.user) {
          getDoc(postData.user).then(userDoc => {
            post.user = userDoc.data();
            setDocs(prevPosts =>
              prevPosts.map(p => (p.docId === post.docId ? post : p))
            );
          });
        }

        if (postData.comments) {
          Promise.all(
            postData.comments.map(comment =>
              getDoc(comment.user).then(doc => doc.data())
            )
          ).then(commentUsers => {
            post.comments = postData.comments.map((comment, index) => ({
              ...comment,
              user: commentUsers[index],
            }));
            setDocs(prevPosts =>
              prevPosts.map(p => (p.docId === post.docId ? post : p))
            );
          });
        }

        updatedPosts.push(post);
      });

      setDocs(updatedPosts);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Navigation />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full px-5 sm:px-[8%]">
        <div className="flex flex-col">
          <h1 className="text-3xl my-5 font-semibold">
            Dobro došli {currentUser.displayName}! 👋
          </h1>
          {user?.isAdmin ? (
            <p className="mt-5">
              Prijavljeni ste kao administrator. Kako bi vidjeli
              administratorsku ploču kliknite{" "}
              <Link to="/admin" className="text-teal-500 hover:underline">
                ovdje
              </Link>
              .
            </p>
          ) : docs.lenght === 0 ? (
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
              return (
                <Post
                  key={item.docId}
                  postId={item.docId}
                  postDetail={item}
                  onDeleteHandler={onDelete}
                />
              );
            })
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
