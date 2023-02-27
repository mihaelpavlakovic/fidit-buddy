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
import { FaEdit } from "react-icons/fa";

const Admin = () => {
	const [users, setUsers] = useState([]);
	let userUid = localStorage.getItem("uid");

	const handleSetRole = async (uid) => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, {
			studentMentor: true,
		})
			.then(() => alert("Korisniku je uspjesno dodana uloga student-mentora."))
			.catch((err) => console.log(err));
	};

	const handleRemoveRole = async (uid) => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, {
			studentMentor: false,
		})
			.then(() => alert("Korisniku je uspjesno oduzeta uloga student-mentora."))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		const userCollRef = collection(db, "users");
		const q = query(userCollRef, where("uid", "!=", userUid));
		const unsub = onSnapshot(q, (snap) => {
			let documents = [];
			snap.forEach((doc) => {
				documents.push({ ...doc.data() });
			});
			setUsers(documents);
		});
		return () => unsub();
	}, [userUid]);

	const UserList = ({ userData }) => {
		return (
			<li>
				<h2>
					{userData.displayName}{" "}
					<span>{userData.studentMentor && "Student-mentor"}</span>
				</h2>
				<p>{userData.email}</p>
				<p>{userData.jmbag}</p>
				{userData.studentMentor ? (
					<button
						onClick={() => handleRemoveRole(userData.uid)}
						className="bg-red-500 text-md text-white p-3 rounded-lg hover:bg-red-600"
					>
						Ukloni student-mentora
					</button>
				) : (
					<button
						onClick={() => handleSetRole(userData.uid)}
						className="bg-teal-500 text-md text-white p-3 rounded-lg hover:bg-teal-600"
					>
						Postavi za student-mentora
					</button>
				)}
			</li>
		);
	};

	const UserRow = ({ userData }) => {
		return (
			<tr class="block md:table-row hover:bg-gray-50 py-4 px-5">
				<td class="block md:table-cell md:px-6 md:py-4">
					<div className="flex items-center justify-between">
						<div class="flex items-center w-full">
							<img
								class="w-12 h-12 rounded-md"
								src={userData.photoURL}
								alt="Slika profila"
							/>
							<div class="pl-3">
								<div class="flex items-center font-semibold">
									{userData.displayName}
									<span class="bg-gray-600 text-gray-100 text-xs ml-4 px-2.5 py-0.5 rounded-full md:hidden">
										Mentor {/* {userData.role} */}
									</span>
								</div>
								<div class="text-gray-500">{userData.email}</div>
							</div>
						</div>
						<FaEdit className="text-2xl mr-2 md:hidden" />
					</div>
				</td>
				<td class="block md:hidden lg:table-cell md:px-6 md:py-4 hidden">
					{userData.jmbag}
				</td>
				<td class="md:table-cell md:px-6 md:py-4 hidden">
					<select id="role" className="hover:cursor-pointer">
						<option selected>Odaberi ulogu</option>
						<option value="mentor">Mentor</option>
						<option value="brocuš">Brocuš</option>
					</select>
				</td>
				<td class="block md:table-cell md:px-6 md:py-4 hidden">
					<span class="inline-block w-1/3 md:hidden">
						Dodijeljeni mentor/brocuši
					</span>
					Bruno Šavor, Ivan Vinski
				</td>
				<td class="md:table-cell md:px-6 md:py-4 hidden">
					<FaEdit className="text-2xl" />
				</td>
			</tr>
		);
	};

	return (
		<div>
			<Navigation />

			<div className="flex justify-center my-5">
				<div className="w-full sm:w-4/5 md:w-11/12 xl:w-4/5 2xl:w-2/3">
					<h2 className="text-3xl font-semibold mx-5">
						Pregled svih korisnika
					</h2>

					<div class="overflow-hidden rounded-lg md:border border-gray-200 md:shadow-md md:mt-5">
						<table class="min-w-full border-collapse block md:table text-left">
							<thead class="block md:table-header-group bg-gray-50">
								<tr class="block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
									<th class="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
										Student
									</th>
									<th class="block md:hidden lg:table-cell md:px-6 md:py-4 font-medium text-gray-900">
										JMBAG
									</th>
									<th class="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
										Uloga
									</th>
									<th class="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
										Dodijeljeni mentor/brocuši
									</th>
									<th class="block md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
										Akcije
									</th>
								</tr>
							</thead>
							<tbody class="block md:table-row-group divide-y divide-gray-200 md:border-t border-gray-100">
								{users.map((item, index) => {
									return <UserRow key={index} userData={item} />;
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className="w-5/6 mx-auto">
				<h1 className="text-3xl mt-5">Svi korisnici unutar aplikacije:</h1>
				<ul>
					{users.lenght === 0 ? (
						<p className="mt-5">Trenutačno nema kreiranih korisnika.</p>
					) : (
						users.map((item, index) => {
							return <UserList key={index} userData={item} />;
						})
					)}
				</ul>
			</div>
		</div>
	);
};

export default Admin;
