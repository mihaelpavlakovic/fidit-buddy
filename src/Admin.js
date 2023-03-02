import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import {
	doc,
	updateDoc,
	collection,
	onSnapshot,
	query,
	where,
	arrayUnion,
	arrayRemove,
	deleteField,
} from "firebase/firestore";
import { db } from "./firebase";
import { FaEdit } from "react-icons/fa";
import Select from "react-select";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [freshmen, setFreshmen] = useState([]);

	let userUid = localStorage.getItem("uid");

	const handleUpdateRole = (uid) => async (e) => {
		const getUserDoc = doc(db, "users", uid);

		await updateDoc(getUserDoc, {
			isMentor: e.target.value === "true",
			assignedMentorFreshmen: deleteField(),
		})
			.then(() => alert("Studentu je uspješno promijenjena uloga."))
			.catch((err) => console.log(err));
	};

	// OVO SE MALO ZAKOMPLICIRALO ali RADI
	const updateMentorFreshmen =
		(userUid, userName, assignedUser) => async (option) => {
			let assignedUserUid = null;
			let assignedUsers = null;

			// kada dodajemo/uklanjamo brucoše kod mentora
			if (Array.isArray(option)) {
				if (!Array.isArray(assignedUser)) assignedUser = [];
				assignedUsers = option
					.filter((x) => !assignedUser.includes(x))
					.concat(assignedUser.filter((x) => !option.includes(x)));
				assignedUserUid = assignedUsers[0].value;
			} else {
				// kada dodajemo/uklanjamo mentora kod brucoša
				if (!assignedUser) assignedUserUid = option.value;
				if (assignedUser) assignedUserUid = assignedUser.value;
			}

			const userDoc = doc(db, "users", userUid);
			const assignedUserDoc = doc(db, "users", assignedUserUid);

			await updateDoc(userDoc, { assignedMentorFreshmen: option })
				.then(() => {})
				.catch((err) => console.log(err));

			if (assignedUsers != null && assignedUsers.length > 1) {
				try {
					assignedUsers.forEach(async (user) => {
						const assignedUserDoc = doc(db, "users", user.value);
						await updateDoc(assignedUserDoc, { assignedMentorFreshmen: null });
					});
				} catch (err) {
					console.log(err);
				} finally {
					alert("Studentu je uspješno promijenjen dodijeljeni mentor/brucoši.");
				}
			} else {
				await updateDoc(
					assignedUserDoc,
					Array.isArray(option)
						? {
								assignedMentorFreshmen:
									option.length > assignedUser.length
										? { value: userUid, label: userName }
										: null,
						  }
						: {
								assignedMentorFreshmen: option
									? arrayUnion({ value: userUid, label: userName })
									: arrayRemove({ value: userUid, label: userName }),
						  }
				)
					.then(() => {
						alert(
							"Studentu je uspješno promijenjen dodijeljeni mentor/brucoši."
						);
					})
					.catch((err) => console.log(err));
			}
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
				if (doc.data().isMentor) {
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
											userData.isMentor
												? "bg-gray-600 text-gray-100"
												: "bg-gray-100 text-gray-600"
										}`}
									>
										{userData.isMentor ? "Mentor" : "Brucoš"}
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
							userData.isMentor
								? "bg-gray-600 text-gray-100"
								: "bg-gray-100 text-gray-900"
						}`}
						defaultValue={userData.isMentor}
						onChange={handleUpdateRole(userData.uid)}
					>
						<option value={true}>Mentor</option>
						<option value={false}>Brucoš</option>
					</select>
				</td>
				<td className="block md:table-cell md:px-6 md:py-4 hidden">
					<Select
						onChange={updateMentorFreshmen(
							userData.uid,
							userData.displayName,
							userData.assignedMentorFreshmen
						)}
						closeMenuOnSelect={!userData.isMentor}
						defaultValue={userData.assignedMentorFreshmen}
						isClearable
						isMulti={userData.isMentor}
						options={userData.isMentor ? freshmen : mentors}
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
