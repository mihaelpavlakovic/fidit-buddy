import { useFormik } from "formik";
import * as Yup from "yup";
import app from "./firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
      const authentication = getAuth(app);
      try {
        await sendPasswordResetEmail(authentication, values.email);
        alert("Password reset link sent!");
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
  });
  return (
    <main className="h-screen items-center flex justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-lg md:w-1/2 shadow-xl"
      >
        <div className="text-gray-700  p-20">
          <h1 className="text-3xl pb-2">Ponovno postavite vašu lozinku</h1>
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
            <button
              type="submit"
              className="bg-teal-500 text-sm text-white py-3 mt-6 rounded-lg w-full"
            >
              Pošalji
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PasswordReset;
