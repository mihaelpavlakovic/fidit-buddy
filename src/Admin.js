import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import {
	doc,
	updateDoc,
	collection,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { db } from "./firebase";
import { FaEdit, FaSave } from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [freshmen, setFreshmen] = useState([]);

	let userUid = localStorage.getItem("uid");

	const handleUpdateRole = (uid) => async (e) => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, {
			role: e.target.value,
		})
			.then(() => alert("Studentu je uspješno promijenjena uloga."))
			.catch((err) => console.log(err));
	};

	const updateMentor = (uid) => async (option) => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, {
			assignedMentor: option,
		})
			.then(() =>
				alert("Studentu je uspješno promijenjen dodijeljeni mentor/brucoši.")
			)
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		const userCollRef = collection(db, "users");
		const q = query(userCollRef, where("uid", "!=", userUid));
		const unsub = onSnapshot(q, (snap) => {
			let documents = [];
			let mentorDocs = [];
			let freshmanDocs = [];
			snap.forEach((doc) => {
				documents.push({ ...doc.data() });
				if (doc.data().role === "Mentor") {
					mentorDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				} else {
					freshmanDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				}
			});
			setUsers(documents);
			setMentors(mentorDocs);
			setFreshmen(freshmanDocs);
		});
		return () => unsub();
	}, [userUid]);

	const UserRow = ({ userData }) => {
		return (
			<tr className="block md:table-row hover:bg-gray-50 py-4 px-5">
				<td className="block md:table-cell md:px-6 md:py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center w-full">
							<img
								className="w-12 h-12 rounded-md"
								src={userData.photoURL}
								alt="Slika profila"
							/>
							<div className="pl-3">
								<div className="flex items-center font-semibold">
									{userData.displayName}
									<span
										className={`text-xs ml-4 px-2.5 py-0.5 rounded-full md:hidden ${
											userData.role === "Mentor"
												? "bg-gray-600 text-gray-100"
												: "bg-gray-100 text-gray-600"
										}`}
									>
										{userData.role}
									</span>
								</div>
								<div className="text-gray-500">{userData.email}</div>
							</div>
						</div>
						<FaEdit className="text-2xl mr-2 md:hidden" />
					</div>
				</td>
				<td className="block md:hidden lg:table-cell md:px-6 md:py-4 hidden">
					{userData.jmbag}
				</td>
				<td className="md:table-cell md:px-6 md:py-4 hidden">
					<select
						className={`hover:cursor-pointer rounded-full px-2 py-1 ${
							userData.role === "Mentor"
								? "bg-gray-600 text-gray-100"
								: "bg-gray-100 text-gray-900"
						}`}
						defaultValue={userData.role}
						onChange={handleUpdateRole(userData.uid)}
					>
						<option value="Mentor">Mentor</option>
						<option value="Brucoš">Brucoš</option>
					</select>
				</td>
				<td className="block md:table-cell md:px-6 md:py-4 hidden">
					<Select
						onChange={updateMentor(userData.uid)}
						closeMenuOnSelect={userData.role === "Mentor" ? false : true}
						components={animatedComponents}
						defaultValue={userData.assignedMentor}
						isClearable
						isMulti={userData.role === "Mentor" ? true : false}
						options={userData.role === "Mentor" ? freshmen : mentors}
						theme={(theme) => ({
							...theme,
							colors: {
								...theme.colors,
								primary: "#14b8a6",
								primary25: "#ccfbf1",
							},
						})}
						styles={{
							multiValue: (base) => ({
								...base,
								backgroundColor: "#f3f4f6",
							}),
						}}
					/>
				</td>
				<td className="md:table-cell md:px-6 md:py-4 hidden text-center">
					<button
						type="button"
						onClick={updateMentor}
						className="rounded-md text-gray-600 transform active:scale-75 align-middle transition-transform"
					>
						<FaSave size="1.5rem" />
					</button>
				</td>
			</tr>
		);
	};

	return (
		<div>
			<Navigation />

			<div className="flex justify-center my-5 md:mx-5">
				<div className="w-full sm:w-4/5 md:w-auto">
					<h2 className="text-3xl font-semibold mx-5">
						Pregled svih korisnika
					</h2>

					{users.length === 0 ? (
						<div className="p-4 m-5 text-yellow-900 text-center font-medium rounded-lg bg-yellow-100 shadow-md">
							Trenutno nema registriranih korisnika!
						</div>
					) : (
						<div className="rounded-lg md:border border-gray-200 md:shadow-md md:mt-5">
							<table className="min-w-full border-collapse block md:table text-left">
								<thead className="block md:table-header-group bg-gray-50">
									<tr className="block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
										<th className="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
											Student
										</th>
										<th className="block md:hidden lg:table-cell md:px-6 md:py-4 font-medium text-gray-900">
											JMBAG
										</th>
										<th className="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
											Uloga
										</th>
										<th className="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
											Dodijeljeni mentor/brucoši
										</th>
										<th className="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
											Akcije
										</th>
									</tr>
								</thead>
								<tbody className="block md:table-row-group divide-y divide-gray-200 md:border-t border-gray-100">
									{users.map((item, index) => {
										return <UserRow key={index} userData={item} />;
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Admin;
