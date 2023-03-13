import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../database/firebase";
import Message from "./Message";

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const { data } = useContext(ChatContext);

	useEffect(() => {
		console.log(data.chatId);
		const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});

		return () => {
			unSub();
		};
	}, [data.chatId]);

	return (
		<div
			className="p-5 overflow-y-scroll flex flex-col gap-4"
			style={{ height: "calc(100% - 80px)" }}
		>
			{messages.map((m) => (
				<Message message={m} key={m.id} />
			))}
		</div>
	);
};

export default Messages;
