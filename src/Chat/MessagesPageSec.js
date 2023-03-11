import { onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";

const MessagesPageSec = ({
	senderUid,
	senderName,
	senderPhoto,
	messagesDocRef,
}) => {
	let navigate = useNavigate();
	const messagesEndRef = useRef(null);
	const { state } = useLocation();
	const [messages, setMessages] = useState([]);
	const { currentUser } = useContext(AuthContext);

	if (state) {
		senderUid = state.value;
		senderName = state.label;
		senderPhoto = state.image;
		messagesDocRef = state.messDocRef;
		console.log(state);
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		if (messagesDocRef) {
			const unsub = onSnapshot(messagesDocRef, (doc) => {
				setMessages(doc.data().messages);
			});
			return unsub;
		} else {
			setMessages([]);
		}
	}, [messagesDocRef]);

	return (
		<>
			{/* <Navigation /> */}
			<main className="w-full">
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
				<div className="flex flex-col p-4 gap-2 h-[calc(100%-138px)]">
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
				<div className="flex fixed md:relative w-full bottom-0 p-2 gap-2 border-t-2">
					<div className="w-full relative">
						<input
							className="w-full h-full border p-2 rounded-md pr-20 outline-teal-500"
							type="text"
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
					<button className="p-3 bg-teal-500 text-white rounded-md hover:bg-teal-600">
						<FiSend size={22} />
					</button>
				</div>
			</main>
		</>
	);
};

export default MessagesPageSec;
