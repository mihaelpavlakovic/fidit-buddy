import { useCallback, useEffect, useMemo, useState } from "react";
import Navigation from "./Navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import AdminUsersTable, {
	AvatarCell,
	SelectColumnFilter,
	RoleCell,
	MentorFreshmenCell,
} from "./AdminUsersTable";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

function Admin() {
	const [users, setUsers] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [freshmen, setFreshmen] = useState([]);

	useEffect(() => {
		const userCollRef = collection(db, "users");
		const q = query(userCollRef, where("isAdmin", "==", false));

		const unsub = onSnapshot(q, (snap) => {
			const userDocs = [];
			const mentorDocs = [];
			const freshmanDocs = [];
			snap.forEach((doc) => {
				userDocs.push({ id: doc.id, ...doc.data() });
				if (doc.data().isMentor) {
					mentorDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				} else if (doc.data().assignedMentorFreshmen == null) {
					freshmanDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				}
			});
			setUsers(userDocs);
			setMentors(mentorDocs);
			setFreshmen(freshmanDocs);
		});

		return unsub;
	}, []);

	const data = useMemo(() => users, [users]);

	const columns = useMemo(
		() => [
			{
				Header: () => null,
				id: "expander",
				Cell: ({ row }) => (
					// Use Cell to render an expander for each row.
					// We can use the getToggleRowExpandedProps prop-getter
					// to build the expander.
					<span
						className="flex justify-center"
						{...row.getToggleRowExpandedProps()}
					>
						{row.isExpanded ? (
							<FaChevronDown size={25} />
						) : (
							<FaChevronRight size={25} />
						)}
					</span>
				),
			},
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
				accessor: "assignedMentorFreshmen.value",
				labelAccessor: "assignedMentorFreshmen.label",
				Cell: MentorFreshmenCell,
				mentors: mentors,
				freshmen: freshmen,
			},
		],
		[mentors, freshmen]
	);

	// Create a function that will render our row sub components
	const renderRowSubComponent = useCallback(
		({ row }) => (
			<div>
				<div>JMBAG: {row.values.jmbag}</div>
			</div>
		),
		[]
	);

	return (
		<div>
			<Navigation />
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
				<h1 className="text-3xl font-semibold">Pregled svih korisnika</h1>
				<div className="mt-5">
					<AdminUsersTable
						columns={columns}
						data={data}
						renderRowSubComponent={renderRowSubComponent}
					/>
				</div>
			</main>
		</div>
	);
}

export default Admin;
