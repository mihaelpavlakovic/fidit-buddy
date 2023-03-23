// react imports
import { Link } from "react-router-dom";
import { useState } from "react";

// component imports
import Button from "../utils/Button";
import Modal from "../utils/Modal";

// firebase imports
import { auth, db } from "../database/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// library imports
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Registration = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState("");
  const handleClose = () => setInfo("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      jmbag: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .max(40, t("Formik.nameMax"))
        .required(t("Formik.nameReq")),
      email: Yup.string()
        .email(t("Formik.email"))
        .required(t("Formik.emailReq")),
      password: Yup.string()
        .required(t("Formik.passwordReq"))
        .min(8, t("Formik.passwordMin")),
      passwordConfirmation: Yup.string()
        .required(t("Formik.passwordConfirmReq"))
        .oneOf([Yup.ref("password"), null], t("Formik.passwordMatch")),
      jmbag: Yup.string()
        .required(t("Formik.jmbagReq"))
        .matches(/^[0-9]+$/, t("Formik.jmbagMatch"))
        .min(10, t("Formik.jmbagMinMax"))
        .max(10, t("Formik.jmbagMinMax")),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setPersistence(auth, browserSessionPersistence).then(async () => {
          const res = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );

          const user = res.user;
          await updateProfile(user, {
            displayName: values.name,
            photoURL:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          });

          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, {
            uid: user.uid,
            displayName: values.name,
            email: values.email,
            jmbag: values.jmbag,
            isMentor: false,
            isAdmin: false,
            assignedMentorFreshmen: null,
            photoURL:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          });

          sendEmailVerification(auth.currentUser).then(() => {
            signOut(auth);
            let verInfo = { message: "verification-required" };
            setInfo(verInfo);
            resetForm();
          });

          toast.success("Uspješno ste kreirali novi korisnički račun");
          toast.info("Poslali smo Vam email za verifikaciju kreiranog računa.");
        });
      } catch (err) {
        toast.error(
          "Došlo je do pogreške prilikom kreiranja vašeg korisničkog računa"
        );
      }
    },
  });

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Modal onClose={handleClose} displayModal={info} />
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg shadow-xl sm:w-2/3 lg:w-1/2"
      >
        <div className="text-gray-700 p-5 p-5 md:p-10">
          <h1 className="text-3xl pb-2">{t("Registration.title")}</h1>
          <p className="text-md sm:text-lg text-gray-500">
            {t("Registration.subTitle")}
          </p>
          <div className="mt-4">
            {/* Name input field */}
            <div className="pb-4">
              <label
                htmlFor="name"
                className={`block text-sm pb-2 ${
                  formik.touched.name && formik.errors.name
                    ? "text-red-400"
                    : ""
                } `}
              >
                {formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : t("Registration.name")}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500 "
                type="text"
                name="name"
                placeholder={t("Placeholders.name")}
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Email input field */}
            <div className="pb-4">
              <label
                htmlFor="email"
                className={`block text-sm pb-2 ${
                  formik.touched.email && formik.errors.email
                    ? "text-red-400"
                    : ""
                }`}
              >
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : "Email"}
              </label>

              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                type="email"
                name="email"
                placeholder={t("Placeholders.email")}
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* JMBAG input field */}
            <div className="pb-4">
              <label
                htmlFor="jmbag"
                className={`block text-sm pb-2 ${
                  formik.touched.jmbag && formik.errors.jmbag
                    ? "text-red-400"
                    : ""
                }`}
              >
                {formik.touched.jmbag && formik.errors.jmbag
                  ? formik.errors.jmbag
                  : "JMBAG"}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                type="string"
                name="jmbag"
                placeholder={t("Placeholders.jmbag")}
                onChange={formik.handleChange}
                value={formik.values.jmbag}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Password input field */}
            <div className="pb-4">
              <label
                htmlFor="password"
                className={`block text-sm pb-2 ${
                  formik.touched.password && formik.errors.password
                    ? "text-red-400"
                    : ""
                }`}
              >
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : t("Registration.password")}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                type="password"
                name="password"
                placeholder={t("Placeholders.password")}
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Password Confirmation input field */}
            <div className="pb-4">
              <label
                htmlFor="passwordConfirmation"
                className={`block text-sm pb-2 ${
                  formik.touched.passwordConfirmation &&
                  formik.errors.passwordConfirmation
                    ? "text-red-400"
                    : ""
                }`}
              >
                {formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation
                  ? formik.errors.passwordConfirmation
                  : t("Registration.confirmPassword")}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                type="password"
                name="passwordConfirmation"
                placeholder={t("Placeholders.confirmPassword")}
                onChange={formik.handleChange}
                value={formik.values.passwordConfirmation}
                onBlur={formik.handleBlur}
              />
            </div>
            <Button
              text={t("Buttons.register")}
              btnAction="submit"
              btnType="primary"
              addClasses="py-3 mt-6 w-full"
            />
            <p className="text-center text-gray-500 text-sm mt-5">
              {t("Registration.haveAccount")}{" "}
              <Link to="/prijava" className="text-teal-500 hover:underline">
                {t("Buttons.here")}
              </Link>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Registration;
