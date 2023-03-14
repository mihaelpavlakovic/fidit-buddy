// react imports
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase imports
import { db, storage } from "../database/firebase";
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
import { FiDownload, FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

// context imports
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const MessagesPage = () => {
	let navigate = useNavigate();

	const messagesEndRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [showTime, setShowTime] = useState(false);

	const [text, setText] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedImageValue, setSelectedImageValue] = useState("");
	const [selectedDoc, setSelectedDoc] = useState(null);
	const [selectedDocValue, setSelectedDocValue] = useState("");
	const [loading, setLoading] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const { chatData } = useContext(ChatContext);
	const { dispatch } = useContext(ChatContext);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleKeydown = e => {
		e.code === "Enter" && handleSendMessage();
	};

	const handleSendMessage = async () => {
		let imageUrl = null;
		let docUrl = null;

		const messageDataUpdate = {
			senderUid: currentUser.uid,
			dateTime: Timestamp.now(),
			text: text,
		};

		const updateMessageDoc = async () => {
			await updateDoc(doc(db, "messages", chatData.chatId), {
				messages: arrayUnion({
					id: uuidv4(),
					image: imageUrl,
					document: docUrl,
					...messageDataUpdate,
				}),
			});
			setLoading(false);
		};

		const updateLastMessage = async userUid => {
			await updateDoc(
				doc(db, "users", userUid, "lastChats", chatData.user.id),
				{ ...messageDataUpdate }
			);
		};

		if (text || selectedImage || selectedDoc) {
			setLoading(true);
			if (chatData.chatId !== "null") {
				// Ovo je dio kada već postoje poruke među korisnicima
				if (selectedImage || selectedDoc) {
					let imgName = "";
					selectedImage
						? (imgName = selectedImage.name)
						: (imgName = selectedDoc.name);

					let imagePath =
						"chatImages/" +
						String(chatData.chatId) +
						"/" +
						String(uuidv4()) +
						"/" +
						imgName;

					const storageRef = ref(storage, imagePath);

					uploadBytes(storageRef, selectedImage || selectedDoc).then(
						snapshot => {
							setSelectedImage(null);
							setSelectedImageValue("");
							setSelectedDoc(null);
							setSelectedDocValue("");
							getDownloadURL(snapshot.ref).then(async downloadURL => {
								if (selectedDoc) docUrl = downloadURL;
								if (selectedImage) imageUrl = downloadURL;
								updateMessageDoc();
								updateLastMessage(currentUser.uid);
								updateLastMessage(chatData.user.interlocutorUid);
							});
						}
					);
				} else {
					updateMessageDoc();
					updateLastMessage(currentUser.uid);
					updateLastMessage(chatData.user.interlocutorUid);
				}
			} else {
				// Ovo je dio kada još nemamo međusobnih poruka
				const messageDocRef = doc(collection(db, "messages"));

				const addAllDocuments = async imageUrl => {
					const messageData = {
						messagesUid: messageDocRef.id,
						senderUid: currentUser.uid,
						dateTime: Timestamp.now(),
						text: text,
						image: imageUrl,
						document: docUrl,
					};

					await setDoc(messageDocRef, {
						messages: [
							{
								id: uuidv4(),
								...messageData,
							},
						],
					}).then(async () => {
						await addDoc(
							collection(db, "users", currentUser.uid, "lastChats"),
							{
								interlocutorUid: chatData.user.interlocutorUid,
								...messageData,
							}
						).then(async secondDoc => {
							let chatUpdated = { ...chatData.user };
							chatUpdated.messagesUid = messageDocRef.id;
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
									interlocutorUid: currentUser.uid,
									...messageData,
								}
							);

							setLoading(false);
						});
					});
				};

				if (selectedImage || selectedDoc) {
					let imgName = "";
					selectedImage
						? (imgName = selectedImage.name)
						: (imgName = selectedDoc.name);

					let imagePath =
						"chatImages/" +
						String(messageDocRef.id) +
						"/" +
						String(uuidv4()) +
						"/" +
						imgName;

					const storageRef = ref(storage, imagePath);

					uploadBytes(storageRef, selectedImage || selectedDoc).then(
						snapshot => {
							setSelectedImage(null);
							setSelectedImageValue("");
							setSelectedDoc(null);
							setSelectedDocValue("");
							getDownloadURL(snapshot.ref).then(async downloadURL => {
								if (selectedDoc) docUrl = downloadURL;
								if (selectedImage) imageUrl = downloadURL;
								addAllDocuments(downloadURL);
							});
						}
					);
				} else {
					addAllDocuments(null);
				}
			}
			setText("");
		}
	};

	const getPreviusMessageInfo = (message, index) => {
		if (index > 0) {
			if (messages[index - 1].senderUid === message.senderUid) return true;
		}
		return false;
	};

	const getNextMessageInfo = (message, index) => {
		if (index < messages.length - 1) {
			if (messages[index + 1].senderUid === message.senderUid) return true;
		}
		return false;
	};

	const getCurrentMessageInfo = message => {
		if (message.senderUid === currentUser.uid) return true;
		return false;
	};

	const handleDownloadDoc = url => {
		fetch(url)
			.then(response => response.blob())
			.then(blob => {
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", ref(storage, url).name);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			});
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		setMessages([]);
		const unSub = onSnapshot(doc(db, "messages", chatData.chatId), doc => {
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
								className="h-10 w-10 rounded-md shadow-md object-cover"
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
										getCurrentMessageInfo(message)
											? "flex-row-reverse"
											: "flex-row"
									} ${
										getPreviusMessageInfo(message, index) ? "mt-0.5" : "mt-4"
									}`}
								>
									<div className="h-8 w-8 flex-shrink-0">
										<img
											className={`h-8 w-8 rounded-md shadow-md object-cover ${
												getPreviusMessageInfo(message, index) ? "hidden" : ""
											}`}
											src={
												getCurrentMessageInfo(message)
													? currentUser.photoURL
													: chatData?.user.senderPhoto
											}
											alt="Slika profila"
										/>
									</div>
									<div className="max-w-[65%]">
										<div
											onClick={() =>
												setShowTime(message.id === showTime ? null : message.id)
											}
											className={`flex flex-col ${
												getCurrentMessageInfo(message)
													? "justify-end items-end"
													: "justify-start"
											}`}
										>
											{message.text && (
												<div
													className={`text-sm w-fit text-white shadow-md px-2.5 py-1.5 rounded-xl ${
														getCurrentMessageInfo(message)
															? "bg-teal-500 rounded-tr-none"
															: "bg-gray-500 rounded-tl-none"
													} ${
														getNextMessageInfo(message, index)
															? getCurrentMessageInfo(message)
																? "rounded-br-none"
																: "rounded-bl-none"
															: ""
													}`}
												>
													{message.text}
												</div>
											)}
											{message.image && (
												<div className="mt-0.5">
													<img
														className={`rounded-xl shadow-md ${
															getCurrentMessageInfo(message)
																? "rounded-tr-none"
																: "rounded-tl-none"
														} ${
															getNextMessageInfo(message, index)
																? getCurrentMessageInfo(message)
																	? "rounded-br-none"
																	: "rounded-bl-none"
																: ""
														}`}
														alt="Poslana/primljena slika"
														src={message.image}
													/>
												</div>
											)}
											{message.document && (
												<div
													className={`text-sm w-fit text-white shadow-md rounded-xl hover:bg-teal-600 ${
														getCurrentMessageInfo(message)
															? "bg-teal-500 rounded-tr-none"
															: "bg-gray-500 rounded-tl-none"
													} ${
														getNextMessageInfo(message, index)
															? getCurrentMessageInfo(message)
																? "rounded-br-none"
																: "rounded-bl-none"
															: ""
													}`}
												>
													<a
														href={message.document}
														className="inline-flex items-center gap-2 px-2.5 py-1.5"
														rel="noreferrer"
														target="_blank"
													>
														<FiDownload size={15} />
														{ref(storage, message.document).name}
													</a>
													{/* Ovo treba vidjet za preuzimanje, CORS policy */}
													<button
														type="button"
														onClick={() => handleDownloadDoc(message.document)}
														className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-teal-600"
													>
														<FiDownload size={15} />
														{ref(storage, message.document).name}
													</button>
												</div>
											)}
										</div>
										<div
											className={`text-xs text-gray-500 ${
												showTime === message.id ? "" : "hidden"
											} ${
												getCurrentMessageInfo(message)
													? "text-right"
													: "text-left"
											}`}
										>
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
				{selectedImage && (
					<div className="md:absolute bottom-16 left-0 right-0 bg-white/50 flex justify-center p-1 border-t-2">
						<div className="relative">
							<img
								className="h-28 rounded-md shadow-md"
								alt="Pregled odabrane slike"
								src={URL.createObjectURL(selectedImage)}
							/>
							<button
								type="button"
								className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white m-0.5 p-1 rounded-md"
								onClick={() => {
									setSelectedImageValue("");
									setSelectedImage(null);
								}}
							>
								<FiTrash2 />
							</button>
						</div>
					</div>
				)}

				{selectedDoc && (
					<div className="md:absolute bottom-16 left-0 right-0 bg-white/50 flex justify-center py-1 px-4 border-t-2">
						<div className="flex bg-gray-200 text-gray-600 px-2 py-1 rounded-md gap-2 items-center max-w-full">
							<div className="text-sm truncate">{selectedDoc.name}</div>
							<button
								type="button"
								className="hover:text-gray-900 p-1"
								onClick={() => {
									setSelectedDocValue("");
									setSelectedDoc(null);
								}}
							>
								<FiTrash2 />
							</button>
						</div>
					</div>
				)}

				<div className="flex w-full p-2 gap-2 border-t-2">
					<div className="w-full relative">
						<input
							className="w-full h-full border p-2 rounded-md shadow-md pr-20 outline-teal-500 disabled:cursor-not-allowed"
							type="text"
							onChange={e => setText(e.target.value)}
							onKeyDown={handleKeydown}
							value={text}
							disabled={!chatData.user.senderName}
							placeholder="Unesi poruku..."
						/>
						<span className="absolute inset-y-0 right-0 grid place-content-center m-1 text-gray-400">
							<div className="flex items-center">
								<input
									type="file"
									id="file"
									alt="Odabir datoteke"
									className="hidden"
									disabled={!chatData.user.senderName || selectedImage}
									value={selectedDocValue}
									onChange={e => setSelectedDoc(e.target.files[0])}
								/>
								<label
									htmlFor="file"
									className="p-2 hover:text-gray-600 hover:cursor-pointer"
								>
									<FiPaperclip size={18} />
								</label>

								<input
									type="file"
									id="image"
									accept="image/*"
									alt="Odabir slike"
									className="hidden"
									disabled={!chatData.user.senderName || selectedDoc}
									value={selectedImageValue}
									onChange={e => setSelectedImage(e.target.files[0])}
								/>
								<label
									htmlFor="image"
									className="p-2 hover:text-gray-600 hover:cursor-pointer"
								>
									<BiImageAdd size={20} />
								</label>
							</div>
						</span>
					</div>
					<button
						onClick={handleSendMessage}
						className="p-3 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600 disabled:cursor-wait"
						disabled={loading}
					>
						{loading ? (
							<ImSpinner2 size={22} className="animate-spin" />
						) : (
							<FiSend size={22} />
						)}
					</button>
				</div>
			</main>
		</>
	);
};

export default MessagesPage;
