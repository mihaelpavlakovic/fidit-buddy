import React from "react";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import Select from "react-select";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useAsyncDebounce,
	useSortBy,
	usePagination,
	useExpanded,
} from "react-table";
import {
	FaSort,
	FaSortUp,
	FaSortDown,
	FaAngleDoubleLeft,
	FaAngleLeft,
	FaAngleRight,
	FaAngleDoubleRight,
} from "react-icons/fa";

// Define a default UI for filtering
function GlobalFilter({
	preGlobalFilteredRows,
	globalFilter,
	setGlobalFilter,
}) {
	const count = preGlobalFilteredRows.length;
	const [value, setValue] = React.useState(globalFilter);
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);

	return (
		<label className="flex gap-x-2 items-baseline">
			<span className="text-gray-700">Pretraži: </span>
			<input
				type="text"
				className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				value={value || ""}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder={`${count} zapisa...`}
			/>
		</label>
	);
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
	column: { filterValue, setFilter, id, render },
}) {
	// Render a multi-select box
	return (
		<label className="flex gap-x-2 items-baseline">
			<span className="text-gray-700">{render("Header")}: </span>
			<select
				className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				name={id}
				id={id}
				value={filterValue}
				onChange={(e) => {
					setFilter(e.target.value || undefined);
				}}
			>
				<option value="">Svi</option>
				<option value={true}>Mentori</option>
				<option value={false}>Brucoši</option>
			</select>
		</label>
	);
}

export function RoleCell({ value, column, row }) {
	const handleUpdateRole = (uid) => async (e) => {
		const getUserDoc = doc(db, "users", uid);

		await updateDoc(getUserDoc, {
			isMentor: e.target.value === "true",
			assignedMentorFreshmen: deleteField(),
		})
			.then(() => alert("Studentu je uspješno promijenjena uloga."))
			.catch((err) => console.log(err));
	};

	return (
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
	);
}

export function AvatarCell({ value, column, row }) {
	return (
		<div className="flex items-center">
			<div className="flex-shrink-0 h-10 w-10">
				<img
					className="h-10 w-10 rounded-full"
					src={row.original[column.imgAccessor]}
					alt="Slika profila"
				/>
			</div>
			<div className="ml-4">
				<div className="text-sm font-medium text-gray-900">{value}</div>
				<div className="text-sm text-gray-500">
					{row.original[column.emailAccessor]}
				</div>
			</div>
		</div>
	);
}

export function MentorFreshmenCell({ value, column, row }) {
	return (
		<Select
			// onChange={updateMentorFreshmen(
			// 	userData.uid,
			// 	userData.displayName,
			// 	userData.assignedMentorFreshmen
			// )}
			closeMenuOnSelect={!row.original.isMentor}
			defaultValue={row.original.assignedMentorFreshmen}
			isClearable
			isMulti={row.original.isMentor}
			options={row.original.isMentor ? column.freshmen : column.mentors}
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
	);
}

function AdminUsersTable({ columns, data, renderRowSubComponent }) {
	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		visibleColumns,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state,
		preGlobalFilteredRows,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		useExpanded,
		usePagination
	);

	// Render the UI for your table
	return (
		<>
			<div className="sm:flex sm:gap-x-2">
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={state.globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				{headerGroups.map((headerGroup) =>
					headerGroup.headers.map((column) =>
						column.Filter ? (
							<div className="mt-2 sm:mt-0" key={column.id}>
								{column.render("Filter")}
							</div>
						) : null
					)
				)}
			</div>
			{/* table */}
			<div className="mt-4 flex flex-col">
				<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
					<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
						<div className="sm:shadow-md sm:rounded-lg">
							<table {...getTableProps()} className="min-w-full">
								<thead className="hidden sm:table-header-group bg-gray-50">
									{headerGroups.map((headerGroup) => (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column) => (
												// Add the sorting props to control sorting. For this example
												// we can add them into the header props
												<th
													scope="col"
													className={`group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
														column.Header === "JMBAG"
															? "hidden md:table-cell"
															: ""
													} ${
														column.Header === "Dodijeljeni mentor/brucoši"
															? "hidden sm:table-cell"
															: ""
													} ${column.id === "expander" ? "sm:hidden" : ""}`}
													{...column.getHeaderProps(
														column.getSortByToggleProps()
													)}
												>
													<div className="flex items-center justify-between">
														{column.render("Header")}
														{/* Add a sort direction indicator */}
														<span>
															{column.isSorted ? (
																column.isSortedDesc ? (
																	<FaSortDown className="w-4 h-4 text-gray-400" />
																) : (
																	<FaSortUp className="w-4 h-4 text-gray-400" />
																)
															) : (
																<FaSort className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
															)}
														</span>
													</div>
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody
									{...getTableBodyProps()}
									className="bg-white divide-y divide-gray-200"
								>
									{page.map((row, i) => {
										// new
										prepareRow(row);
										return (
											<React.Fragment key={row.getRowProps().key}>
												<tr>
													{row.cells.map((cell) => {
														return (
															<td
																{...cell.getCellProps()}
																className={`px-2 sm:px-6 py-4 whitespace-nowrap ${
																	cell.column.Header === "JMBAG"
																		? "hidden md:table-cell"
																		: ""
																} ${
																	cell.column.Header ===
																	"Dodijeljeni mentor/brucoši"
																		? "hidden sm:table-cell"
																		: ""
																} ${
																	cell.column.id === "expander"
																		? "pl-4 sm:hidden"
																		: ""
																}`}
																role="cell"
															>
																{cell.column.Cell.name === "defaultRenderer" ? (
																	<div className="text-sm text-gray-500">
																		{cell.render("Cell")}
																	</div>
																) : (
																	cell.render("Cell")
																)}
															</td>
														);
													})}
												</tr>
												{row.isExpanded ? (
													<tr>
														<td colSpan={visibleColumns.length}>
															{/*
																Inside it, call our renderRowSubComponent function. In reality,
																you could pass whatever you want as props to
																a component like this, including the entire
																table instance. But for this example, we'll just
																pass the row
															*/}
															{renderRowSubComponent({ row })}
														</td>
													</tr>
												) : null}
											</React.Fragment>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{/* Pagination */}
			<div className="py-3 flex items-center justify-between">
				<div className="flex-1 flex justify-between sm:hidden">
					<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						Previous
					</button>
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						Next
					</button>
				</div>
				<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
					<div className="flex gap-x-2 items-baseline">
						<span className="text-sm text-gray-700">
							Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
							<span className="font-medium">{pageOptions.length}</span>
						</span>
						<label>
							<span className="sr-only">Items Per Page</span>
							<select
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								value={state.pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
								}}
							>
								{[5, 10, 20].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										Show {pageSize}
									</option>
								))}
							</select>
						</label>
					</div>
					<div>
						<nav
							className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
							aria-label="Pagination"
						>
							<button
								className="rounded-l-md"
								onClick={() => gotoPage(0)}
								disabled={!canPreviousPage}
							>
								<span className="sr-only">First</span>
								<FaAngleDoubleLeft
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</button>
							<button
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
							>
								<span className="sr-only">Previous</span>
								<FaAngleLeft
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</button>
							<button onClick={() => nextPage()} disabled={!canNextPage}>
								<span className="sr-only">Next</span>
								<FaAngleRight
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</button>
							<button
								className="rounded-r-md"
								onClick={() => gotoPage(pageCount - 1)}
								disabled={!canNextPage}
							>
								<span className="sr-only">Last</span>
								<FaAngleDoubleRight
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</button>
						</nav>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminUsersTable;
