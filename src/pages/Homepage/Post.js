// react imports
import { useContext } from "react";

// component imports
import PostComments from "./PostComments";

// library imports
import { FiSend } from "react-icons/fi";
import { BiEdit, BiTrash } from "react-icons/bi";
import { AiFillFilePdf } from "react-icons/ai";
import { useFormik } from "formik";

// fireabse imports
import { db, storage } from "../../database/firebase";
import { ref, deleteObject } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// context imports
import { AuthContext } from "../../context/AuthContext";

const Post = ({
  postDetail,
  postId,
  onDeleteHandler,
  onEditHandler,
  editPostHandler,
}) => {
  const { currentUser } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    onSubmit: async values => {
      const userRef = doc(db, "users", currentUser.uid);
      const docRef = doc(db, "posts", postDetail.docId);
      const docSnap = await getDoc(docRef);
      let createComment = {};
      if (!docSnap.data().comments) {
        createComment = {
          ...docSnap.data(),
          comments: [
            {
              comment: values.comment,
              createdAt: Timestamp.fromDate(new Date()).toDate(),
              user: userRef,
            },
          ],
        };
      } else {
        createComment = {
          ...docSnap.data(),
          comments: [
            ...docSnap.data().comments,
            {
              comment: values.comment,
              createdAt: Timestamp.fromDate(new Date()).toDate(),
              user: userRef,
            },
          ],
        };
      }

      try {
        updateDoc(docRef, createComment);
        values.comment = "";
        console.log("Comment created...");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deletePostHandler = async postId => {
    if (
      window.confirm("Potvrdite ukoliko želite obrisati vašu objavu.") === true
    ) {
      const docRef = doc(db, "posts", postId);
      Object.entries(postDetail.data).forEach(item => {
        let documentRef = ref(storage, item[1].documentURL);
        deleteObject(documentRef)
          .then(() => console.log("Dokument uspjesno izbrisan"))
          .catch(err => console.log(err));
      });

      await deleteDoc(docRef)
        .then(() => {
          alert("Objava uspjesno obrisana.");
        })
        .catch(error => {
          console.log(error);
        });
    }
    return;
  };

  return (
    <div className="w-full lg:w-2/3 p-5 sm:px-10 shadow-lg mx-auto mb-10 drop-shadow-md rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <img
            className="w-11 h-11 rounded-md"
            src={postDetail.user.photoURL}
            alt="Slika profila student-mentora"
          />
          <div className="w-full">
            <div className="flex items-center">
              <h3 className="flex-auto font-semibold flex items-center">
                {postDetail.user.displayName}
                {postDetail.user.isMentor && (
                  <span className="text-xs font-normal ml-2 bg-gray-200 px-2 py-0.5 rounded-full">
                    mentor
                  </span>
                )}
              </h3>
              <div className="text-xs text-gray-500">
                <div>
                  {postDetail.createdAt
                    ?.toDate()
                    .toLocaleDateString("hr-HR")
                    .replace(/\s+/g, "")}{" "}
                  -{" "}
                  {postDetail.createdAt?.toDate().toLocaleTimeString("hr-HR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-right">
                  {currentUser.uid === postDetail.user.uid && (
                    <>
                      <button
                        onClick={() => editPostHandler(postId)}
                        className="pt-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-600 duration-300"
                      >
                        <BiEdit className="text-[14px] mr-2" />
                      </button>
                      <button
                        onClick={() => deletePostHandler(postId)}
                        className="pt-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-600 duration-300"
                      >
                        <BiTrash className="text-[14px]" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="flex text-sm text-gray-500">
              {postDetail.user.email}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{postDetail.postTitle}</h2>
        </div>
        <p className="text-gray-500">{postDetail.postText}</p>
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {postDetail.data.size !== 0 &&
            Object.entries(postDetail.data).map((item, index) => {
              if (item[1].documentURL.includes(".pdf")) {
                return (
                  <a
                    key={index}
                    href={item[1].documentURL}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-200 flex items-center grow p-3 hover:bg-gray-300 "
                  >
                    <AiFillFilePdf className="mr-2" />
                    {item[1].documentName}
                  </a>
                );
              } else {
                return (
                  <img
                    key={index}
                    src={item[1].documentURL}
                    alt={`Slika ${index}`}
                  />
                );
              }
            })}
        </div>
        <div>
          {!postDetail.comments
            ? "Nema komentara"
            : postDetail.comments.map((item, index) => {
                return (
                  <PostComments
                    key={index}
                    comments={item}
                    onDeleteHandler={() => onDeleteHandler(index, postId)}
                    onEditHandler={() => onEditHandler(index, postId)}
                  />
                );
              })}
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex md:flex-row flex-col items-center gap-3"
        >
          <textarea
            className="w-full md:w-5/6 p-2 text-gray-500 rounded-md border-2 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
            rows="1"
            type="text"
            name="comment"
            placeholder="Napiši svoj komentar"
            onChange={formik.handleChange}
            value={formik.values.comment}
          ></textarea>
          <button
            type="submit"
            className="w-full md:w-1/6 bg-teal-500 text-sm text-white py-3 rounded-lg hover:bg-teal-600"
          >
            <FiSend className="w-full" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
