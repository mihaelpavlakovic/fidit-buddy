// react imports
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

// firebase imports
import { db } from "../../database/firebase";
import {
	collection,
	deleteField,
	doc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";

// component imports
import Navigation from "../../components/Navigation";
import Button from "../../utils/Button";
import AdminUsersTable, {
	AvatarCell,
	SelectColumnFilter,
	MentorFreshmenCell,
} from "./AdminUsersTable";

// library imposts
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

// context imports
import { AuthContext } from "../../context/AuthContext";

function Admin() {
	const { currentUser } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [freshmen, setFreshmen] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [currentSelection, setCurrentSelection] = useState(null);

	useEffect(() => {
		const userCollRef = collection(db, "users");

		const unsub = onSnapshot(userCollRef, snap => {
			const userDocs = [];
			const adminDocs = [];
			const mentorDocs = [];
			const freshmanDocs = [];
			snap.forEach(doc => {
				if (doc.data().isAdmin) {
					adminDocs.push({ id: doc.id, ...doc.data() });
				} else {
					userDocs.push({ id: doc.id, ...doc.data() });
				}

				if (doc.data().isMentor && !doc.data().isAdmin) {
					mentorDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				} else if (
					doc.data().assignedMentorFreshmen == null &&
					!doc.data().isAdmin
				) {
					freshmanDocs.push({
						value: doc.data().uid,
						label: doc.data().displayName,
					});
				}
			});
			setUsers(userDocs);
			setAdmins(adminDocs);
			setMentors(mentorDocs);
			setFreshmen(freshmanDocs);
		});

		return unsub;
	}, []);

	const data = useMemo(() => users, [users]);

	const handleUpdateRole = uid => async e => {
		const getUserDoc = doc(db, "users", uid);

		await updateDoc(getUserDoc, {
			isMentor: e.target.value === "true",
			assignedMentorFreshmen: deleteField(),
		})
			.then(() => toast.success("Studentu je uspješno promijenjena uloga"))
			.catch(() => toast.error("Došlo je do pogreške pri promjeni uloga"));
	};

	const handleAddAdmin = uid => async e => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, { isAdmin: true })
			.then(() => toast.success("Admin uloga je uspješno dodana"))
			.catch(() =>
				toast.error("Došlo je do pogreške pri dodjeljivanju admin uloge")
			)
			.finally(() => setShowModal(false));
	};

	const handleRemoveAdmin = uid => async e => {
		const getUserDoc = doc(db, "users", uid);
		await updateDoc(getUserDoc, { isAdmin: false })
			.then(() => toast.success("Admin uloga je uspješno uklonjena"))
			.catch(() =>
				toast.error("Došlo je do pogreške prilikom uklanjanja admin uloge")
			);
	};

	const columns = useMemo(
		() => [
			{
				Header: () => null,
				id: "expander",
				Cell: ({ row }) => (
					<span
						className="flex justify-center"
						{...row.getToggleRowExpandedProps()}
					>
						{row.isExpanded ? (
							<FaChevronDown size={15} className="text-gray-500" />
						) : (
							<FaChevronRight size={15} className="text-gray-500" />
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
				<div className="mb-1">
					Dodijeljeni {row.values.isMentor ? "brucoši:" : "mentor:"}
				</div>
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
			<main className="flex justify-center flex-wrap">
				<div className="w-full sm:w-auto sm:min-w-[60%] px-4 sm:px-6 lg:px-8 py-4">
					<h1 className="text-3xl font-semibold">Pregled svih korisnika</h1>
					<div className="my-4">
						<AdminUsersTable
							columns={columns}
							data={data}
							renderRowSubComponent={renderRowSubComponent}
						/>
					</div>
					<hr className="h-1.5 bg-gray-200 rounded" />
					<div className="mt-6 mb-24">
						<h1 className="text-3xl font-semibold">Pregled administratora</h1>
						<div className="flex flex-col justify-center my-2">
							<div className="flex justify-end mb-2">
								<Button
									text="Dodaj novog admina"
									btnAction="button"
									btnType="primary"
									addClasses="w-fit py-2 px-3"
									onClick={() => setShowModal(true)}
								/>
							</div>
							{/* Admins table */}
							<table className="shadow-md overflow-hidden rounded-lg">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Admin
										</th>
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
											Akcije
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{(admins.length > 0 &&
										admins.map((admin, index) => {
											return (
												<tr key={index}>
													<td className="px-2 sm:px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<div className="flex-shrink-0 h-10 w-10">
																<img
																	className="h-10 w-10 rounded-md shadow-md"
																	src={admin.photoURL}
																	alt="Slika profila"
																/>
															</div>
															<div className="ml-2 sm:ml-4">
																<div className="text-sm font-medium text-gray-900">
																	{admin.displayName}
																</div>
																<div className="text-sm text-gray-500">
																	{admin.email}
																</div>
															</div>
														</div>
													</td>
													<td className="px-2 sm:px-6 py-4 whitespace-nowrap text-center">
														<Button
															text="Ukloni admina"
															btnAction="button"
															btnType="danger"
															addClasses="p-1.5"
															isDisabled={admin.uid === currentUser.uid}
															onClick={handleRemoveAdmin(admin.uid)}
														/>
													</td>
												</tr>
											);
										})) || (
										<tr>
											<td
												colSpan={2}
												className="p-4 text-center text-gray-500 font-medium"
											>
												Učitavanje ...
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-sm">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-2xl font-semibold">
										Dodavanje novog admina
									</h3>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									<ReactSelect
										onChange={e => setCurrentSelection(e.value)}
										options={users.map(user => {
											return { value: user.uid, label: user.displayName };
										})}
										theme={theme => ({
											...theme,
											colors: {
												...theme.colors,
												primary: "#14b8a6",
												primary25: "#ccfbf1",
											},
										})}
									/>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-center gap-2 p-6 border-t border-solid border-slate-200 rounded-b">
									<Button
										text="Odustani"
										btnAction="button"
										btnType="secondary"
										addClasses="py-2 w-full"
										onClick={() => setShowModal(false)}
									/>
									<Button
										text="Dodaj admina"
										btnAction="button"
										btnType="primary"
										addClasses="py-2 w-full"
										onClick={handleAddAdmin(currentSelection)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</div>
	);
}

export default Admin;
