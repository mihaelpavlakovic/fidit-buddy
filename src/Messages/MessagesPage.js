import Navigation from "../Navigation";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const Messages = () => {
  return (
    <div>
      <Navigation />
      <main
        className="sm:w-full lg:w-2/3 overflow-hidden rounded-md mx-auto flex mt-1.5"
        style={{ height: "88svh" }}
      >
        <Sidebar />
        <Chat />
      </main>
    </div>
  );
};

export default Messages;
