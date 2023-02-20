import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  // const [owner, setOwner] = useState(false);

  // if (message.senderId === currentUser.uid) {
  //   setOwner(true);
  // }

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      // className={`flex gap-4 ${owner ? "flex-row-reverse" : "flex-row"}`}
      className={`flex flex-row gap-4 ${
        message.senderId === currentUser.uid && "flex-row-reverse"
      }`}
    >
      <div className="flex flex-col">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="Slika profila"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-500 text-xs">just now</span>
      </div>
      <div
        className={`flex flex-col max-w-[70%] ${
          message.senderId === currentUser.uid ? "items-end" : "items-start"
        }`}
      >
        <p
          className={`${
            message.senderId === currentUser.uid
              ? "bg-teal-500 text-white rounded-tr-none"
              : "bg-white rounded-tl-none"
          } rounded-md p-1.5 mb-2`}
          style={{ maxWidth: "max-content" }}
        >
          {message.text}
        </p>
        {/* {message.img && (
          <img
            src={message.img}
            alt=""
            className={`h-[18rem] w-[18rem] rounded-md ${
              owner ? "rounded-tr-none" : "rounded-tl-none"
            }`}
          />
        )} */}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
