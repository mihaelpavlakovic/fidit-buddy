import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "./firebase";
import {
  browserSessionPersistence,
  signInWithEmailAndPassword,
  setPersistence,
} from "firebase/auth";
import Modal from "./Modal";
import { useState } from "react";

const Login = () => {
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
        .email("Neispravan unos emaila")
        .required("Email je obavezan"),
      password: Yup.string()
        .required("Lozinka je obavezna")
        .min(8, "Lozinka je pre kratka - mora bit minimalno 8 znakova dugačka"),
    }),

    onSubmit: async values => {
      try {
        setPersistence(auth, browserSessionPersistence).then(async () => {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          navigate("/");
        });
      } catch (err) {
        setError(err);
      }
    },
  });

  return (
    <main className="h-screen items-center flex justify-center">
      <Modal onClose={handleClose} displayModal={error} />
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-lg md:w-1/2 shadow-xl"
      >
        <div className="text-gray-700  p-20">
          <h1 className="text-3xl pb-2">Prijavi se u svoj račun 👋</h1>
          <p className="text-lg text-gray-500">
            Očekujete nove vijesti na postavljena pitanja student-mentoru?
            Prijavite se i saznajte odgovore na ta pitanja.
          </p>
          <div className="mt-6 ">
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
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                type="email"
                name="email"
                placeholder="Unesi svoju email adresu"
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
                  : "Lozinka"}
              </label>
              <input
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                type="password"
                name="password"
                placeholder="Unesi svoju lozinku"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 text-sm text-white py-3 mt-6 rounded-lg w-full hover:bg-teal-600 hover:font-semibold"
            >
              Prijavi se!
            </button>
            <p className="text-center text-gray-500 text-sm mt-5">
              Nemate kreiran račun? Možete ga kreirati{" "}
              <Link
                to="/registracija"
                className="text-teal-500 underline hover:no-underline hover:font-semibold"
              >
                ovdje
              </Link>
            </p>
            <p className="text-center text-gray-500 text-sm mt-5">
              Zaboravili ste lozinku? Kliknite{" "}
              <Link
                to="/promjena-lozinke"
                className="text-teal-500 underline hover:no-underline hover:font-semibold"
              >
                ovdje
              </Link>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Login;
