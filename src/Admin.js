import { useEffect, useMemo, useState } from "react";
import Navigation from "./Navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import AdminUsersTable, {
	AvatarCell,
	SelectColumnFilter,
	RoleCell,
} from "./AdminUsersTable";

function Admin() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const userCollRef = collection(db, "users");
		const q = query(userCollRef, where("isAdmin", "==", false));

		const unsub = onSnapshot(q, (snap) => {
			const userDocuments = [];
			snap.forEach((doc) => {
				userDocuments.push({ id: doc.id, ...doc.data() });
			});
			setUsers(userDocuments);
		});

		return unsub;
	}, []);

	const data = useMemo(() => users, [users]);

	const columns = useMemo(
		() => [
			{
				Header: "Student",
				accessor: "displayName",
				Cell: AvatarCell,
				imgAccessor: "photoURL",
				emailAccessor: "email",
			},
			{
				Header: "JMBAG",
				accessor: "jmbag",
			},
			{
				Header: "Uloga",
				accessor: "isMentor",
				Cell: RoleCell,
				Filter: SelectColumnFilter,
				uidAccesor: "uid",
				filter: "===",
			},
			{
				Header: "Dodijeljeni mentor/brucoši",
				accessor: "assignedMentorFreshmen.label",
			},
		],
		[]
	);

	return (
		<div>
			<Navigation />
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
				<h1 className="text-3xl font-semibold">Pregled svih korisnika</h1>
				<div className="mt-5">
					<AdminUsersTable columns={columns} data={data} />
				</div>
			</main>
		</div>
	);
}

export default Admin;
