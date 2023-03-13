// react imports
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase imports
import { db } from "../database/firebase";
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	onSnapshot,
	setDoc,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { uuidv4 } from "@firebase/util";

// library imports
import { BiArrowBack, BiImageAdd } from "react-icons/bi";
import { FiPaperclip, FiSend } from "react-icons/fi";

// context imports
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const MessagesPageSec = () => {
	let navigate = useNavigate();
	const messagesEndRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const { currentUser } = useContext(AuthContext);

	const [text, setText] = useState("");

	const { chatData } = useContext(ChatContext);
	const { dispatch } = useContext(ChatContext);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSendMessage = async () => {
		const updateLastMessage = async (userUid) => {
			await updateDoc(
				doc(db, "users", userUid, "lastChats", chatData.user.id),
				{
					text: text,
					dateTime: Timestamp.now(),
					senderUid: currentUser.uid,
				}
			);
		};

		if (text) {
			if (chatData.chatId !== "null") {
				await updateDoc(doc(db, "messages", chatData.chatId), {
					messages: arrayUnion({
						id: uuidv4(),
						senderUid: currentUser.uid,
						dateTime: Timestamp.now(),
						text: text,
					}),
				});

				updateLastMessage(currentUser.uid);
				updateLastMessage(chatData.user.interlocutorUid);
			} else {
				const messageData = {
					senderUid: currentUser.uid,
					dateTime: Timestamp.now(),
					text: text,
				};

				await addDoc(collection(db, "messages"), {
					messages: [
						{
							id: uuidv4(),
							...messageData,
						},
					],
				}).then(async (firstDoc) => {
					await addDoc(collection(db, "users", currentUser.uid, "lastChats"), {
						messagesUid: firstDoc.id,
						interlocutorUid: chatData.user.interlocutorUid,
						...messageData,
					}).then(async (secondDoc) => {
						let chatUpdated = { ...chatData.user };
						chatUpdated.messagesUid = firstDoc.id;
						chatUpdated.id = secondDoc.id;

						dispatch({ type: "CHANGE_USER", payload: chatUpdated });

						await setDoc(
							doc(
								db,
								"users",
								chatData.user.interlocutorUid,
								"lastChats",
								secondDoc.id
							),
							{
								messagesUid: firstDoc.id,
								interlocutorUid: currentUser.uid,
								...messageData,
							}
						);
					});
				});
			}
			setText("");
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		setMessages([]);
		const unSub = onSnapshot(doc(db, "messages", chatData.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});
		return () => {
			unSub();
		};
	}, [chatData.chatId]);

	return (
		<>
			<main className="flex flex-col absolute md:relative inset-0 w-full">
				{/* Header */}
				<div className="flex items-center bg-teal-500 md:bg-white text-white md:text-black shadow-md md:shadow-none sticky top-0 md:py-4 md:border-b-2">
					<button
						type="button"
						className="p-4 md:hidden"
						onClick={() => navigate(-1)}
					>
						<BiArrowBack size={30} />
					</button>
					<div className="h-10 w-10 mx-4">
						{(chatData?.user.senderPhoto && (
							<img
								className="h-10 w-10 rounded-md"
								src={chatData?.user.senderPhoto}
								alt="Slika profila"
							/>
						)) || <div className="h-10 w-10 rounded-md bg-gray-200" />}
					</div>
					<h2 className="text-xl font-medium">{chatData?.user.senderName}</h2>
				</div>

				{/* Messages container */}
				<div className="flex-1 md:flex-initial flex-col p-4 gap-2 overflow-auto md:h-[calc(100vh-210px)]">
					{messages.length > 0 &&
						messages.map((message, index) => {
							return (
								<div
									key={index}
									className={`flex w-full gap-2 ${
										message.senderUid === currentUser.uid
											? "flex-row-reverse"
											: "flex-row"
									}`}
								>
									<div className="h-8 w-8 flex-shrink-0">
										<img
											className="h-8 w-8 rounded-md"
											src={
												message.senderUid === currentUser.uid
													? currentUser.photoURL
													: chatData?.user.senderPhoto
											}
											alt="Slika profila"
										/>
									</div>
									<div className="max-w-[65%]">
										<div
											className={`flex ${
												message.senderUid === currentUser.uid
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`text-sm w-fit text-white p-1.5 rounded-xl ${
													message.senderUid === currentUser.uid
														? "bg-teal-500 rounded-tr-none"
														: "bg-gray-500 rounded-tl-none"
												}`}
											>
												{message.text}
											</div>
										</div>
										<div className="text-xs text-gray-500 mt-0.5">
											{message.dateTime.toDate().toLocaleString("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								</div>
							);
						})}
					<div ref={messagesEndRef} />
				</div>

				{/* Message input */}
				<div className="flex w-full p-2 gap-2 border-t-2">
					<div className="w-full relative">
						<input
							className="w-full h-full border p-2 rounded-md pr-20 outline-teal-500"
							type="text"
							onChange={(e) => setText(e.target.value)}
							value={text}
							placeholder="Unesi poruku..."
						/>
						<span className="absolute inset-y-0 right-0 grid place-content-center m-1 text-gray-400">
							<div className="flex">
								<button type="button" className="p-2 hover:text-gray-600">
									<FiPaperclip size={18} />
								</button>
								<button type="button" className="p-2 hover:text-gray-600">
									<BiImageAdd size={20} />
								</button>
							</div>
						</span>
					</div>
					<button
						onClick={handleSendMessage}
						className="p-3 bg-teal-500 text-white rounded-md hover:bg-teal-600"
					>
						<FiSend size={22} />
					</button>
				</div>
			</main>
		</>
	);
};

export default MessagesPageSec;
