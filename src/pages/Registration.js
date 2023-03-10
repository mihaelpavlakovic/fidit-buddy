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

const Registration = () => {
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
				.max(40, "Ime mora sadržavat 40 znakova ili manje.")
				.required("Ime je obavezno"),
			email: Yup.string()
				.email("Neispravan unos emaila")
				.required("Email je obavezan"),
			password: Yup.string()
				.required("Lozinka je obavezna")
				.min(8, "Lozinka je pre kratka - mora bit minimalno 8 znakova dugacka"),
			passwordConfirmation: Yup.string()
				.required("Potvrda lozinke je obavezna")
				.oneOf([Yup.ref("password"), null], "Lozinke moraju biti iste"),
			jmbag: Yup.string()
				.required("JMBAG je obavezan")
				.matches(/^[0-9]+$/, "Mora sadržavat samo brojeve")
				.min(10, "Mora sadržavat točno 10 znamenki")
				.max(10, "Mora sadržavat točno 10 znamenki"),
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
		<main className="items-center flex justify-center sm:min-h-screen">
			<Modal onClose={handleClose} displayModal={info} />
			<form
				onSubmit={formik.handleSubmit}
				className="rounded-lg shadow-xl m-5 sm:w-5/6 lg:w-1/2"
			>
				<div className="text-gray-700 p-5 sm:p-10 md:p-20">
					<h1 className="text-3xl pb-2">Kreiraj svoj račun 👋</h1>
					<p className="text-md sm:text-lg text-gray-500">
						Novi ste i imate puno neodgovorenih pitanja u vezi novo upisanog
						fakulteta? Nema problema, pridruži se našoj platformi i postavi sva
						svoja pitanja student-mentorima.
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
									: "Ime"}
							</label>
							<input
								className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500 "
								type="text"
								name="name"
								placeholder="Unesi svoje ime"
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
								placeholder="Unesi svoju email adresu"
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
								placeholder="Unesi svoj JMBAG"
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
									: "Lozinka"}
							</label>
							<input
								className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
								type="password"
								name="password"
								placeholder="Unesi svoju lozinku"
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
									: "Potvrda lozinke"}
							</label>
							<input
								className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
								type="password"
								name="passwordConfirmation"
								placeholder="Ponovite svoju lozinku"
								onChange={formik.handleChange}
								value={formik.values.passwordConfirmation}
								onBlur={formik.handleBlur}
							/>
						</div>
						<Button
							text="Kreiraj račun!"
							btnAction="submit"
							btnType="primary"
							addClasses="py-3 mt-6 w-full"
						/>
						<p className="text-center text-gray-500 text-sm mt-5">
							Imate kreiran račun? Možete se prijaviti{" "}
							<Link to="/prijava" className="text-teal-500 hover:underline">
								ovdje
							</Link>
						</p>
					</div>
				</div>
			</form>
		</main>
	);
};

export default Registration;
