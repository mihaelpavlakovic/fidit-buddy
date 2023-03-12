import Navigation from "../Navigation";
import Post from "./Post";
import EditModal from "../EditModal";
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
  where,
} from "firebase/firestore";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    comment: "",
    comIndex: "",
    docId: "",
    docFromDb: "",
  });
  const handleClose = () =>
    setShowModal({
      show: false,
      comment: "",
      comIndex: "",
      docId: "",
      docFromDb: "",
    });

  const onDeleteHandler = async (comIndex, docId) => {
    if (
      window.confirm("Potvrdite ukoliko želite obrisati vaš komentar.") === true
    ) {
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
    }
    return;
  };

  const userData = useCallback(async () => {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? setUser(docSnap.data()) : null;

      if (data === null || data === undefined) return null;
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      userData();
    }
  }, [userData, currentUser]);

  useEffect(() => {
    if (user !== null) {
      if (user.isAdmin === false) {
        if (!Object.is(user.assignedMentorFreshmen, null)) {
          let userDocRef = undefined;
          if (!!user.isMentor) {
            userDocRef = doc(db, "users/" + currentUser.uid);
          } else {
            userDocRef = doc(db, "users/" + user.assignedMentorFreshmen.value);
          }
          const q = query(
            collection(db, "posts"),
            where("user", "==", userDocRef),
            orderBy("createdAt", "desc")
          );
          // const q = query(postsRef, orderBy("createdAt", "desc"));

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
        }
      }
    }
  }, [user, currentUser.uid]);

  return (
    <>
      <Navigation />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full px-5 sm:px-[8%]">
        {showModal.show && (
          <EditModal
            onClose={handleClose}
            comment={showModal.comment}
            comIndex={showModal.comIndex}
            docId={showModal.docId}
            docFromDb={showModal.docFromDb}
          />
        )}
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
          ) : docs.length === 0 ? (
            <p className="mt-5">Trenutačno nema objava.</p>
          ) : (
            docs.map(item => {
              if (item.user.uid === user?.assignedMentorFreshmen?.value) {
                return (
                  <Post
                    key={item.docId}
                    postId={item.docId}
                    postDetail={item}
                    onEditHandler={async (index, docId) => {
                      const docRef = doc(db, "posts", docId);
                      const docForChange = await getDoc(docRef).then(doc =>
                        doc.data()
                      );
                      setShowModal({
                        show: true,
                        comment: docForChange.comments[index].comment,
                        comIndex: index,
                        docId: docId,
                        docFromDb: "",
                      });
                    }}
                    onDeleteHandler={onDeleteHandler}
                  />
                );
              }
              if (user?.isMentor && user?.uid === item.user.uid) {
                return (
                  <Post
                    key={item.docId}
                    postId={item.docId}
                    postDetail={item}
                    onDeleteHandler={onDeleteHandler}
                    editPostHandler={async postId => {
                      const docRef = doc(db, "posts", postId);
                      const docForChange = await getDoc(docRef).then(doc =>
                        doc.data()
                      );
                      setShowModal({
                        show: true,
                        comment: "",
                        comIndex: "",
                        docId: postId,
                        docFromDb: docForChange,
                      });
                    }}
                    onEditHandler={async (index, docId) => {
                      const docRef = doc(db, "posts", docId);
                      const docForChange = await getDoc(docRef).then(doc =>
                        doc.data()
                      );
                      setShowModal({
                        show: true,
                        comment: docForChange.comments[index].comment,
                        comIndex: index,
                        docId: docId,
                        docFromDb: "",
                      });
                    }}
                  />
                );
              }
              return null;
            })
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
