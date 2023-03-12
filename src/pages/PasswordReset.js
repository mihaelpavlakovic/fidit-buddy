// react imports
import { Link } from "react-router-dom";

// firebase imports
import { auth } from "../database/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// library imports
import { useFormik } from "formik";
import * as Yup from "yup";

const PasswordReset = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Neispravan unos emaila")
        .required("Email je obavezan"),
    }),

    onSubmit: async values => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        alert("Password reset link sent!");
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
  });
  return (
    <main className="sm:h-screen items-center flex justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg shadow-xl m-5 md:w-1/2"
      >
        <div className="text-gray-700 p-5 sm:p-10 md:p-20">
          <h1 className="text-3xl pb-2">Ponovno postavite vašu lozinku</h1>
          <div className="mt-6">
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
            <button
              type="submit"
              className="bg-teal-500 text-sm text-white py-3 mt-6 rounded-lg w-full hover:bg-teal-600 hover:font-semibold"
            >
              Pošalji
            </button>
            <p className="text-center text-gray-500 text-sm mt-5">
              Zalutali ste? Za povratak kliknite{" "}
              <Link
                to="/prijava"
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

export default PasswordReset;
