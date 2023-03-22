// react imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// redux imports
import {
  deleteCommentAction,
  getAllPostsAction,
} from "../../store/Actions/DatabaseActions";
import { useDispatch, useSelector } from "react-redux";

// component imports
import Navigation from "../../components/Navigation";
import Post from "./Post";
import EditModal from "../../utils/EditModal";

// fireabse imports
import { db } from "../../database/firebase";
import { getDoc, doc } from "firebase/firestore";

const Homepage = () => {
  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user.user);
  const docs = useSelector(state => state.database.posts);
  const [showModal, setShowModal] = useState(false);
  const [showModalType, setShowModalType] = useState("");
  const [modalData, setModalData] = useState({});

  const closeModalHandler = () => setShowModal(!showModal);

  const deleteCommentHandler = (comIndex, docId) => {
    if (window.confirm("Potvrdite ukoliko želite obrisati vaš komentar.")) {
      dispatch(deleteCommentAction(comIndex, docId));
    }
    return;
  };

  useEffect(() => {
    if (stateUser !== null) {
      if (stateUser.isAdmin === false) {
        if (!Object.is(stateUser.assignedMentorFreshmen, null)) {
          let userDocRef = undefined;
          if (!!stateUser.isMentor) {
            userDocRef = doc(db, "users/" + stateUser.uid);
          } else {
            userDocRef = doc(
              db,
              "users/" + stateUser.assignedMentorFreshmen?.value
            );
          }
          dispatch(getAllPostsAction(userDocRef));
        }
      }
    }
  }, [stateUser, dispatch]);

  return (
    <>
      <Navigation />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full px-5 sm:px-[8%]">
        {showModal && (
          <EditModal
            modalType={showModalType}
            handleCloseModal={closeModalHandler}
            comment={modalData.comment}
            comIndex={modalData.comIndex}
            docId={modalData.docId}
            docFromDb={modalData.docFromDb}
          />
        )}
        <div className="flex flex-col">
          <h1 className="text-3xl my-5 font-semibold">
            Dobro došli {stateUser?.displayName}! 👋
          </h1>
          {stateUser?.isAdmin ? (
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
              if (item.user.uid === stateUser?.assignedMentorFreshmen?.value) {
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
                    onDeleteHandler={deleteCommentHandler}
                  />
                );
              }
              if (stateUser?.isMentor && stateUser?.uid === item.user.uid) {
                return (
                  <Post
                    key={item.docId}
                    postId={item.docId}
                    postDetail={item}
                    onDeleteHandler={deleteCommentHandler}
                    editPostHandler={async postId => {
                      const docRef = doc(db, "posts", postId);
                      const docForChange = await getDoc(docRef).then(doc =>
                        doc.data()
                      );
                      setShowModal(true);
                      setShowModalType("editPost");
                      setModalData({
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
                      setShowModal(true);
                      setShowModalType("editComment");
                      setModalData({
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
