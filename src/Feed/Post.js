import PostComments from "./PostComments";
import { FiSend } from "react-icons/fi";
import { useFormik } from "formik";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const Post = ({ postDetail }) => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    onSubmit: async values => {
      const userUid = user.uid;
      const db = getFirestore();
      const userRef = doc(db, "users", userUid);
      const userDocSnap = await getDoc(userRef);
      const docRef = doc(db, "posts", postDetail.docId);
      const docSnap = await getDoc(docRef);
      let createComment = {};
      if (!docSnap.data().comments) {
        createComment = {
          ...docSnap.data(),
          comments: [
            {
              comment: values.comment,
              commentCreatedDate: new Date().toLocaleDateString("hr-HR"),
              commentCreatedTime: new Date().toLocaleString("hr-HR", {
                hour: "numeric",
                minute: "numeric",
              }),
              user: { ...userDocSnap.data() },
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
              commentCreatedDate: new Date().toLocaleDateString("hr-HR"),
              commentCreatedTime: new Date().toLocaleString("hr-HR", {
                hour: "numeric",
                minute: "numeric",
              }),
              user: { ...userDocSnap.data() },
            },
          ],
        };
      }

      try {
        updateDoc(docRef, createComment);
        console.log("Comment created...");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const postCode = (
    <div className="w-full lg:w-2/3 px-10 py-5 shadow-lg mx-auto my-8 drop-shadow-md">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-row items-center gap-4 text-sm">
            <img
              className="w-11 h-11 rounded-md"
              src={postDetail.user.photoUrl}
              alt="Slika profila student-mentora"
            />
            <div className="flex flex-col justify-start">
              <h3 className="text-md font-semibold">{postDetail.user.name}</h3>
              <p className="text-gray-500">{postDetail.user.email}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-end">
            <p>{postDetail.createdDate}</p>
            <p>{postDetail.createdTime}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{postDetail.postTitle}</h2>
        </div>
        <p className="text-gray-500 mb-2">{postDetail.postText}</p>
        <div>
          {!postDetail.comments
            ? "Nema komentara"
            : postDetail.comments.map((item, index) => {
                return <PostComments key={index} comments={item} />;
              })}
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex md:flex-row flex-col items-end gap-3"
        >
          <textarea
            className="w-full md:w-5/6 p-2 text-gray-500 border-2 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
            rows="3"
            type="text"
            name="comment"
            placeholder="Napiši svoj komentar"
            onChange={formik.handleChange}
            value={formik.values.comment}
          ></textarea>
          <button
            type="submit"
            className="w-full md:w-1/6 bg-teal-500 text-sm text-white py-3 rounded-lg w-full hover:bg-teal-600"
          >
            <FiSend className="w-full" />
          </button>
        </form>
      </div>
    </div>
  );

  return <>{loading ? "Ucitavanje..." : postCode}</>;
};

export default Post;
