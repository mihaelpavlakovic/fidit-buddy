// react imports
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Actions/UserActions";

// component imports
import Modal from "../utils/Modal";
import Button from "../utils/Button";

// library imports
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleClose = () => setError("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("Formik.email"))
        .required(t("Formik.emailReq")),
      password: Yup.string()
        .required(t("Formik.passwordReq"))
        .min(8, t("Formik.passwordMin")),
    }),

    onSubmit: values => {
      dispatch(login({ email: values.email, password: values.password }));
    },
  });

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  const stateUser = useSelector(state => state.user.userData);

  useEffect(() => {
    if (stateUser) {
      navigate("/");
    }
  }, [stateUser, navigate]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Modal onClose={handleClose} displayModal={error} />
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg shadow-xl sm:w-2/3 lg:w-1/2"
      >
        <div className="text-gray-700 p-5 md:p-10">
          <h1 className="text-3xl pb-2">{t("Login.title")}</h1>
          <p className="text-lg text-gray-500">{t("Login.subTitle")}</p>
          <div className="mt-4">
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
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500 outline-none"
                type="email"
                name="email"
                placeholder={t("Placeholders.email")}
                onChange={formik.handleChange}
                value={formik.values.email}
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
                  : t("Login.password")}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500 outline-none"
                type="password"
                name="password"
                placeholder={t("Placeholders.password")}
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
            </div>
            <Button
              text={t("Buttons.login")}
              btnAction="submit"
              btnType="primary"
              addClasses="py-3 mt-6 w-full"
            />
            <p className="text-center text-gray-500 text-sm mt-5">
              {t("Login.createAccount")}{" "}
              <Link
                to="/registracija"
                className="text-teal-500 hover:underline"
              >
                {t("Buttons.here")}
              </Link>
            </p>
            <p className="text-center text-gray-500 text-sm mt-5">
              {t("Login.forgotPassword")}{" "}
              <Link
                to="/promjena-lozinke"
                className="text-teal-500 hover:underline"
              >
                {t("Buttons.here")}
              </Link>
            </p>
            <div className="flex flex-row flex-wrap gap-2 justify-center mt-8">
              <p className="text-gray-500 w-full text-center text-sm">
                Can't understand this language? Change it here:
              </p>
              <Button
                text="hr"
                btnAction="button"
                btnType="secondary"
                addClasses="py-1 px-3"
                onClick={() => changeLanguage("hr")}
              />
              <Button
                text="en"
                btnAction="button"
                btnType="secondary"
                addClasses="py-1 px-3"
                onClick={() => changeLanguage("en")}
              />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Login;
