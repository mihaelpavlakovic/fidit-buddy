import Navigation from "../Navigation";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const Messages = () => {
	return (
		<div>
			<Navigation />
			<main className="sm:w-full lg:w-2/3 h-[calc(100vh-100px)] overflow-hidden sm:rounded-md mx-auto flex">
				<Sidebar />
				<Chat />
			</main>
		</div>
	);
};

export default Messages;
