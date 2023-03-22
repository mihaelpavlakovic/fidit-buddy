// redux imports
import { useDispatch, useSelector } from "react-redux";
import { deletePostAction } from "../../store/Actions/DatabaseActions";

// component imports
import PostComments from "./PostComments";
import Button from "../../utils/Button";

// library imports
import { FiSend } from "react-icons/fi";
import { BiEdit, BiTrash } from "react-icons/bi";
import { AiFillFilePdf } from "react-icons/ai";
import { useFormik } from "formik";

// fireabse imports
import { db } from "../../database/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

// library imports
import { toast } from "react-toastify";

// helper imports
import { formatDateTime } from "../../helper/functions";

const Post = ({
  postDetail,
  postId,
  onDeleteHandler,
  onEditHandler,
  editPostHandler,
}) => {
  const stateUser = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    onSubmit: async values => {
      const userRef = doc(db, "users", stateUser.uid);
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
        toast.success("Uspješno ste ostavili komentar");
      } catch (error) {
        toast.error("Došlo je do pogreške u ostavljanju komentara");
      }
    },
  });

  const deletePostHandler = postId => {
    if (window.confirm("Potvrdite ukoliko želite obrisati vašu objavu.")) {
      dispatch(deletePostAction(postId, postDetail));
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
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="flex-auto font-semibold flex items-center">
                  {postDetail.user.displayName}
                </h3>
                <p className="text-sm text-gray-500">{postDetail.user.email}</p>
              </div>
              <div className="text-xs text-gray-500">
                <div>{formatDateTime(postDetail.createdAt)}</div>
                <div className="text-right">
                  {stateUser.uid === postDetail.user.uid && (
                    <>
                      <Button
                        text=""
                        btnAction="button"
                        btnType="icon"
                        addClasses="pt-2 mr-2"
                        onClick={() => editPostHandler(postId)}
                      >
                        <BiEdit size={20} />
                      </Button>
                      <Button
                        text=""
                        btnAction="button"
                        btnType="icon"
                        addClasses="pt-2"
                        onClick={() => deletePostHandler(postId)}
                      >
                        <BiTrash size={20} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{postDetail.postTitle}</h2>
        </div>
        <p className="text-gray-500">{postDetail.postText}</p>
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {postDetail.data.size !== 0 &&
            Object.entries(postDetail.data).map((item, index) => {
              if (
                item[1].documentURL.includes(".pdf") ||
                item[1].documentURL.includes(".txt") ||
                item[1].documentURL.includes(".docx") ||
                item[1].documentURL.includes(".doc")
              ) {
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
          <Button
            text=""
            btnAction="submit"
            btnType="primary"
            addClasses="py-3 w-full md:w-1/6"
          >
            <FiSend className="w-full" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Post;
