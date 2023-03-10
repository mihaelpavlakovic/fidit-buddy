// react imports
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// component imports
import Modal from "../utils/Modal";
import Button from "../utils/Button";

// fireabse imports
import { auth } from "../database/firebase";
import {
	browserLocalPersistence,
	signInWithEmailAndPassword,
	setPersistence,
	signOut,
} from "firebase/auth";

// library imports
import { useFormik } from "formik";
import * as Yup from "yup";

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
			setPersistence(auth, browserLocalPersistence)
				.then(async () => {
					await signInWithEmailAndPassword(
						auth,
						values.email,
						values.password
					).then(userCredential => {
						const user = userCredential.user;
						if (user.emailVerified) navigate("/");
						else {
							signOut(auth);
							let error = { message: "not-verified" };
							setError(error);
						}
					});
				})
				.catch(error => setError(error));
		},
	});

	return (
		<main className="items-center flex justify-center sm:min-h-screen">
			<Modal onClose={handleClose} displayModal={error} />
			<form
				onSubmit={formik.handleSubmit}
				className="rounded-lg shadow-xl m-5 sm:w-5/6 lg:w-1/2"
			>
				<div className="text-gray-700 p-5 sm:p-10 md:p-20">
					<h1 className="text-3xl pb-2">Prijavi se u svoj račun 👋</h1>
					<p className="text-lg text-gray-500">
						Očekujete nove vijesti na postavljena pitanja student-mentoru?
						Prijavite se i saznajte odgovore na ta pitanja.
					</p>
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
								className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500 outline-none"
								type="password"
								name="password"
								placeholder="Unesi svoju lozinku"
								onChange={formik.handleChange}
								value={formik.values.password}
								onBlur={formik.handleBlur}
							/>
						</div>
						<Button
							text="Prijavi se!"
							btnAction="submit"
							btnType="primary"
							addClasses="py-3 mt-6 w-full"
						/>
						<p className="text-center text-gray-500 text-sm mt-5">
							Nemate kreiran račun? Možete ga kreirati{" "}
							<Link
								to="/registracija"
								className="text-teal-500 hover:underline"
							>
								ovdje
							</Link>
						</p>
						<p className="text-center text-gray-500 text-sm mt-5">
							Zaboravili ste lozinku? Kliknite{" "}
							<Link
								to="/promjena-lozinke"
								className="text-teal-500 hover:underline"
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
