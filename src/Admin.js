import { useCallback, useEffect, useMemo, useState } from "react";
import Navigation from "./Navigation";
import {
	collection,
	deleteField,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "./firebase";
import AdminUsersTable, {
	AvatarCell,
	SelectColumnFilter,
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

	const handleUpdateRole = (uid) => async (e) => {
		const getUserDoc = doc(db, "users", uid);

		await updateDoc(getUserDoc, {
			isMentor: e.target.value === "true",
			assignedMentorFreshmen: deleteField(),
		})
			.then(() => alert("Studentu je uspješno promijenjena uloga."))
			.catch((err) => console.log(err));
	};

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
				Cell: ({ value, column, row }) => (
					<select
						className={`text-sm hover:cursor-pointer rounded-full px-2 py-1 ${
							value ? "bg-gray-600 text-gray-100" : "bg-gray-100 text-gray-600"
						}`}
						defaultValue={value}
						onChange={handleUpdateRole(row.original[column.uidAccesor])}
					>
						<option value={true}>Mentor</option>
						<option value={false}>Brucoš</option>
					</select>
				),
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
			<div className="text-gray-600 px-8 py-4">
				<div className="mb-2">JMBAG: {row.values.jmbag}</div>
				<div>Dodijeljeni {row.values.isMentor ? "brucoši:" : "mentor:"}</div>
				<MentorFreshmenCell
					column={{ freshmen: freshmen, mentors: mentors }}
					row={row}
				/>
			</div>
		),
		[freshmen, mentors]
	);

	return (
		<div>
			<Navigation />
			<main className="flex justify-center">
				<div className="w-full sm:w-auto sm:min-w-[60%] px-4 sm:px-6 lg:px-8 py-4">
					<h1 className="text-3xl font-semibold">Pregled svih korisnika</h1>
					<div className="mt-4">
						<AdminUsersTable
							columns={columns}
							data={data}
							renderRowSubComponent={renderRowSubComponent}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}

export default Admin;
