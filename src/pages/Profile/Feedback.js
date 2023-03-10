// react imports
import React, { useContext, useState } from "react";

// component imports
import Button from "../../utils/Button";

// firebase imports
import { db } from "../../database/firebase";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";

// library imports
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";

// context imports
import { AuthContext } from "../../context/AuthContext";

const Feedback = ({ user }) => {
	const [rating, setRating] = useState(null);
	const [hover, setHover] = useState(null);
	const [message, setMessage] = useState("");
	const { currentUser } = useContext(AuthContext);

	const rateMentorHandler = async e => {
		e.preventDefault();
		if (
			window.confirm(
				"Jeste li sigurni da želite ocijenit mentora? Ova akcije se više ne može ponovno izvesti."
			) === true
		) {
			const mentorUid = user.assignedMentorFreshmen.value;
			const docRef = doc(db, "users", mentorUid);
			const docSnap = await getDoc(docRef);
			const data = docSnap.exists() ? docSnap.data() : null;
			const currentUserRef = doc(db, "users", currentUser.uid);

			await updateDoc(currentUserRef, {
				givenReviewMark: rating,
				voted: true,
			});

			if (data === null || data === undefined) return null;
			let increasedCounter =
				data.reviewCount === null || data.reviewCount === undefined
					? 1
					: data.reviewCount + 1;

			await updateDoc(docRef, {
				reviewCount: increasedCounter,
				reviewMark:
					data.reviewMark === null || data.reviewMark === undefined
						? rating
						: data.reviewMark + rating,
				reviewsFrom:
					data.reviewsFrom === null || data.reviewsFrom === undefined
						? [{ uidOfStudent: currentUser.uid, messageFromStudent: message }]
						: arrayUnion({
								uidOfStudent: currentUser.uid,
								messageFromStudent: message,
								rating: rating,
						  }),
			})
				.then(() => {
					setMessage("");
					toast.success("Uspješno ste ocijenili mentora");
				})
				.catch(() => {
					toast.error("Došlo je do pogreške prilikom ocjenjivanja mentora");
				});
		}
		return;
	};

	return (
		<div className="border-2 border-solid rounded-md">
			<h2 className="text-xl border-b-2 border-solid p-3">Ocjenite mentora</h2>
			<p className="text-center mt-2">
				Dodijeljeni mentor:{" "}
				<span className="font-semibold">
					{user?.assignedMentorFreshmen.label}
				</span>
			</p>
			{user?.voted && (
				<div className="flex flex-col items-center my-5">
					<p className="text-center mb-2">
						Ocjenili ste svog mentora sa ocjenom{" "}
					</p>
					<div className="flex">
						{[...Array(user?.givenReviewMark)].map((star, i) => {
							return (
								<AiFillStar
									key={i}
									className="cursor-pointer text-3xl"
									color={"#ffc107"}
								/>
							);
						})}
					</div>
				</div>
			)}
			{!user?.voted && (
				<form
					onSubmit={rateMentorHandler}
					className="flex flex-col items-center"
				>
					<div className="flex justify-center py-5">
						{[...Array(5)].map((star, i) => {
							const ratingValue = i + 1;
							return (
								<label key={i}>
									<input
										className="hidden"
										type="radio"
										name="rating"
										value={ratingValue}
										onClick={() => setRating(ratingValue)}
									/>
									<AiFillStar
										className="cursor-pointer text-3xl"
										color={
											ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
										}
										onMouseEnter={() => setHover(ratingValue)}
										onMouseLeave={() => setHover(null)}
									/>
								</label>
							);
						})}
					</div>
					<div className="mt-2 flex flex-col items-center">
						<label htmlFor="message">Poruka uz ocjenu</label>
						<textarea
							className="border-2 border-solid focus:border-teal-500 rounded-md mt-2 mx-2 p-2 outline-none"
							name="message"
							id="message"
							cols="50"
							rows="5"
							required
							placeholder="Odličan mentor, komunikativan..."
							onChange={e => setMessage(e.target.value)}
							value={message}
						></textarea>
					</div>
					<Button
						text="Ocjeni"
						btnAction="submit"
						btnType="primary"
						addClasses="py-3 my-3 w-[15rem]"
					/>
				</form>
			)}
		</div>
	);
};

export default Feedback;
