// react imports
import { useState, useContext } from "react";
import { useNavigate } from "react-router";

// component imports
import Navigation from "../components/Navigation";
import Button from "../utils/Button";

// fireabse imports
import { db, storage } from "../database/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, addDoc, collection, Timestamp } from "firebase/firestore";

// library imports
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// context imports
import { AuthContext } from "../context/AuthContext";

const CreatePost = () => {
	const [imgUrl, setImgUrl] = useState([]);
	const [newFiles, setNewFiles] = useState([]);
	const [progresspercent, setProgresspercent] = useState(0);
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	const uploadImages = () => {
		const files = [...newFiles];
		const promises = [];
		const links = [];

		if (!files) return;

		files.forEach(item => {
			const storageRef = ref(storage, `files/${item.name}`);
			const uploadTask = uploadBytesResumable(storageRef, item);
			promises.push(uploadTask);
			uploadTask.on(
				"state_changed",
				snapshot => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					setProgresspercent(progress);
				},
				async () => {
					await getDownloadURL(uploadTask.snapshot.ref).then(downloadURLs => {
						links.push({ documentURL: downloadURLs, documentName: item.name });
					});
				}
			);
		});

		Promise.all(promises)
			.then(() => toast.success("Svi priloženi dokumenti su učitani"))
			.catch(() =>
				toast.error(
					"Došlo je do pogreške pri učitavanju priloženih dokumenata u bazu"
				)
			);

		setImgUrl(links);
		setNewFiles([]);
	};

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
			const docRef = doc(db, "users", currentUser.uid);

			const createPost = {
				postTitle: values.postTitle,
				postText: values.postText,
				createdAt: Timestamp.fromDate(new Date()).toDate(),
				user: docRef,
				data: { ...imgUrl },
			};

			try {
				addDoc(collection(db, "posts"), createPost);
				toast.success("Objava uspješno kreirana");
				navigate("/");
			} catch (error) {
				toast.error("Došlo je do pogreške prilikom kreiranja objave");
			}
		},
	});

	return (
		<>
			<Navigation />
			<main className="w-full flex justify-center">
				<form
					onSubmit={formik.handleSubmit}
					className="rounded-lg sm:w-5/6 xl:w-1/2 shadow-xl m-5   border"
				>
					<div className="text-gray-700 p-5 sm:p-20">
						<h1 className="text-3xl">Kreiraj objavu:</h1>
						<div className="mt-4">
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
										: "Naslov"}
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

							<div className="pb-4">
								<label htmlFor="fileInput" className={"block text-sm pb-2"}>
									Datoteke
								</label>

								<input
									className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
									type="file"
									name="fileInput"
									multiple
									onChange={event => {
										const files = event.target.files;
										setNewFiles(files);
									}}
								/>
								<div className="flex gap-2 items-center justify-center mt-3">
									<progress
										className="w-full"
										value={progresspercent}
										max="100"
									/>
									<Button
										text="Učitaj"
										btnAction="button"
										btnType="secondary"
										addClasses="py-1 w-1/6"
										onClick={uploadImages}
									/>
								</div>
							</div>
							<Button
								text="Objavi"
								btnAction="submit"
								btnType="primary"
								addClasses="py-3 w-full"
							/>
						</div>
					</div>
				</form>
			</main>
		</>
	);
};

export default CreatePost;
