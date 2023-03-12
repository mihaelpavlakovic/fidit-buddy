import {
	arrayUnion,
	doc,
	onSnapshot,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { uuidv4 } from "@firebase/util";

const MessagesPageSec = ({
	interlocutorUid,
	senderName,
	senderPhoto,
	messagesUid,
	lastChatUid,
}) => {
	let navigate = useNavigate();
	const messagesEndRef = useRef(null);
	const { state } = useLocation();
	const [messages, setMessages] = useState([]);
	const { currentUser } = useContext(AuthContext);

	const [text, setText] = useState("");

	if (state) {
		interlocutorUid = state.value;
		senderName = state.label;
		senderPhoto = state.image;
		messagesUid = state.messagesUid;
		lastChatUid = state.lastChatUid;
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSendMessage = async () => {
		const updateLastMessage = async (userUid) => {
			await updateDoc(doc(db, "users", userUid, "lastChats", lastChatUid), {
				lastMessage: text,
				received: Timestamp.now(),
				senderUid: currentUser.uid,
			});
		};

		if (text) {
			if (messagesUid) {
				await updateDoc(doc(db, "messages", messagesUid), {
					messages: arrayUnion({
						id: uuidv4(),
						senderUid: currentUser.uid,
						dateTime: Timestamp.now(),
						text: text,
					}),
				});
				updateLastMessage(currentUser.uid);
				updateLastMessage(interlocutorUid);
			}
			setText("");
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (messagesUid) {
			const unsub = onSnapshot(doc(db, "messages", messagesUid), (doc) => {
				setMessages(doc.data().messages);
			});
			return unsub;
		} else {
			setMessages([]);
		}
	}, [messagesUid]);

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
						{(senderPhoto && (
							<img
								className="h-10 w-10 rounded-md"
								src={senderPhoto}
								alt="Slika profila"
							/>
						)) || <div className="h-10 w-10 rounded-md bg-gray-200" />}
					</div>
					<h2 className="text-xl font-medium">{senderName}</h2>
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
													: senderPhoto
											}
											alt="Slika profila"
										/>
									</div>
									<div className="max-w-[65%]">
										<div
											className={`text-sm text-white p-1.5 rounded-xl ${
												message.senderUid === currentUser.uid
													? "bg-teal-500 rounded-tr-none"
													: "bg-gray-500 rounded-tl-none"
											}`}
										>
											{message.text}
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
