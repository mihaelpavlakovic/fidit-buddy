import { useFormik } from "formik";
import * as Yup from "yup";
import Navigation from "./Navigation";
import { getAuth } from "firebase/auth";
import app from "./firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const CreatePost = () => {
  const formik = useFormik({
    initialValues: {
      postTitle: "",
      postText: "",
    },

    validationSchema: Yup.object({
      postTitle: Yup.string()
        .max(60, "Naziv mora sadržavat 60 znakova ili manje.")
        .required("Naziv objave je obavezan"),
      postText: Yup.string()
        .min(10, "Objava mora sadržavat minimalno 10 znakova.")
        .required("Tekst objave je obavezan"),
    }),

    onSubmit: async values => {
      const userUid = getAuth(app).currentUser.uid;
      const db = getFirestore();
      const docRef = doc(db, "users", userUid);
      const docSnap = await getDoc(docRef);

      const createPost = {
        postTitle: values.postTitle,
        postText: values.postText,
        createdDate: new Date().toLocaleDateString("hr-HR"),
        createdTime: new Date().toLocaleString("hr-HR", {
          hour: "numeric",
          minute: "numeric",
        }),
        user: { ...docSnap.data() },
      };
      console.log(createPost);
    },
  });

  return (
    <>
      <Navigation />
      <main className="md:w-5/6 mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-lg md:w-1/2 shadow-xl"
        >
          <div className="text-gray-700  p-20">
            <h1 className="text-3xl pb-2">Kreiraj objavu:</h1>
            <div className="mt-6 ">
              {/* Post Title input field */}
              <div className="pb-4">
                <label
                  htmlFor="postTitle"
                  className={`block text-sm pb-2 ${
                    formik.touched.postTitle && formik.errors.postTitle
                      ? "text-red-400"
                      : ""
                  } `}
                >
                  {formik.touched.postTitle && formik.errors.postTitle
                    ? formik.errors.postTitle
                    : "Naziv"}
                </label>
                <input
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500 "
                  type="text"
                  name="postTitle"
                  placeholder="Unesi naziv objave"
                  onChange={formik.handleChange}
                  value={formik.values.postTitle}
                  onBlur={formik.handleBlur}
                />
              </div>
              {/* Post Text input field */}
              <div className="pb-4">
                <label
                  htmlFor="postText"
                  className={`block text-sm pb-2 ${
                    formik.touched.postText && formik.errors.postText
                      ? "text-red-400"
                      : ""
                  }`}
                >
                  {formik.touched.postText && formik.errors.postText
                    ? formik.errors.postText
                    : "Objava"}
                </label>

                <textarea
                  rows="8"
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                  type="text"
                  name="postText"
                  placeholder="Unesite tekst objave"
                  onChange={formik.handleChange}
                  value={formik.values.postText}
                  onBlur={formik.handleBlur}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-teal-500 text-sm text-white py-3 mt-6 rounded-lg w-full hover:bg-teal-600 hover:font-semibold"
              >
                Objavi
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreatePost;
