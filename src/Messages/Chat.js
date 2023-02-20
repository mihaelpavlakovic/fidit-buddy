import React from "react";
import Messages from "./Messages";
import Input from "./Input";

const Chat = () => {
  return (
    <div className="flex-2 w-2/3 bg-gray-200">
      <div className="flex items-center w-full bg-gray-500 text-white h-10 p-3">
        <span>Jane</span>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
