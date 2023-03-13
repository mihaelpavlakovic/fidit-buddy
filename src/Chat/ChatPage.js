// react imports
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// component imports
import Navigation from "../components/Navigation";
import MessagesPageSec from "./MessagesPageSec";

// firebase imports
import { db } from "../database/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// library imports
import ReactSelect from "react-select";
import { BiImage } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const ChatPage = () => {
	let navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const { currentUser } = useContext(AuthContext);

	const { dispatch } = useContext(ChatContext);
	const [lastChats, setLastChats] = useState([]);
	const [selectedOption, setSelectedOption] = useState();

	const handleSelect = (e) => {
		if (e != null) {
			const existingChat = lastChats.find((x) => x.interlocutorUid === e.value);
			const userData = {
				interlocutorUid: e.value,
				senderPhoto: e.image,
				senderName: e.label,
				messagesUid: existingChat?.messagesUid || "null",
				id: existingChat?.id || "null",
			};
			setSelectedOption("");

			dispatch({ type: "CHANGE_USER", payload: userData });

			let w = window.innerWidth;
			if (w < 768) navigate("/messages");
		}
	};

	const handleSelectExisting = (chat) => {
		dispatch({ type: "CHANGE_USER", payload: chat });

		let w = window.innerWidth;
		if (w < 768) navigate("/messages");
	};

	useEffect(() => {
		const userCollRef = collection(db, "users");

		const unsub = onSnapshot(userCollRef, (snap) => {
			const userDocs = [];
			snap.forEach((doc) => {
				userDocs.push({ id: doc.id, ...doc.data() });
			});
			setUsers(userDocs);
		});

		return unsub;
	}, []);

	useEffect(() => {
		const getChats = () => {
			const lastChatsRef = collection(
				db,
				"users",
				currentUser.uid,
				"lastChats"
			);
			const unsub = onSnapshot(lastChatsRef, (snap) => {
				const lastChatsDocs = [];
				snap.forEach((doc) => {
					const userData = users.find(
						(x) => x.uid === doc.data().interlocutorUid
					);
					const senderPhoto = userData?.photoURL;
					const senderName = userData?.displayName;
					lastChatsDocs.push({
						id: doc.id,
						senderPhoto: senderPhoto,
						senderName: senderName,
						...doc.data(),
					});
				});
				setLastChats(lastChatsDocs);
			});

			return () => {
				unsub();
			};
		};

		currentUser.uid && getChats();
	}, [users, currentUser.uid]);

	const formatOptionLabel = ({ value, label, image }) => (
		<div className="flex items-center">
			<div className="h-10 w-10">
				<img className="h-10 w-10 rounded-md" src={image} alt="Slika profila" />
			</div>
			<div className="ml-4">
				<div className="font-semibold">{label}</div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col absolute inset-0">
			<Navigation />
			<main className="md:flex justify-center">
				<div className="md:flex md:w-full lg:w-4/5 xl:w-2/3 2xl:w-3/5 md:border-x-2">
					{/* Side panel */}
					<div className="flex flex-col md:w-2/5 md:border-r-2">
						{/* Header */}
						<h1 className="text-3xl mx-6 mt-4 font-bold md:my-4">Razgovori</h1>
						{/* Search Users */}
						<ReactSelect
							className="mx-6 my-2"
							value={selectedOption}
							onChange={handleSelect}
							placeholder={"Pretraži korisnike..."}
							formatOptionLabel={formatOptionLabel}
							options={users.map((user) => {
								return {
									value: user.uid,
									label: user.displayName,
									image: user.photoURL,
								};
							})}
							theme={(theme) => ({
								...theme,
								colors: {
									...theme.colors,
									primary: "#14b8a6",
									primary25: "#ccfbf1",
								},
							})}
							styles={{
								control: (base) => ({
									...base,
									borderRadius: 6,
									cursor: "pointer",
								}),
								option: (base) => ({
									...base,
									cursor: "pointer",
								}),
							}}
						/>
						{/* Last Chats Container */}
						<div className="md:h-[calc(100vh-194px)] md:overflow-auto">
							{(lastChats.length > 0 &&
								lastChats.map((chat) => {
									return (
										<div
											key={chat.id}
											onClick={() => handleSelectExisting(chat)}
											className="flex items-center px-6 py-3 hover:bg-gray-100 hover:md:bg-teal-100 transition cursor-pointer"
										>
											<div className="h-12 w-12 flex-shrink-0">
												<img
													className="h-12 w-12 rounded-md shadow-md"
													src={chat.senderPhoto}
													alt="Slika profila"
												/>
											</div>
											<div className="flex flex-col ml-4 w-full overflow-hidden">
												<div className="flex grow justify-between gap-x-2">
													<div className="font-semibold">{chat.senderName}</div>
													<div className="text-xs text-gray-500 text-right">
														{chat.dateTime.toDate().toLocaleString("hr-HR", {
															day: "numeric",
															month: "numeric",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})}
													</div>
												</div>
												<div className="text-sm text-gray-500 truncate overflow-hidden">
													{chat.text || (
														<div className="flex items-center gap-1">
															<BiImage size={16} /> <span>Fotografija</span>
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})) || (
								<div className="flex justify-center m-4">Nema poruka</div>
							)}
						</div>
					</div>

					{/* Messages container */}
					<div className="hidden md:flex w-3/5">
						<MessagesPageSec />
					</div>
				</div>
			</main>
		</div>
	);
};

export default ChatPage;
