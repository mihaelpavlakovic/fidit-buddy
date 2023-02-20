import React from "react";
import Message from "./Message";

const Messages = () => {
  return (
    <div
      className="p-5 overflow-y-scroll flex flex-col gap-4"
      style={{ height: "calc(100% - 80px)" }}
    >
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  );
};

export default Messages;
