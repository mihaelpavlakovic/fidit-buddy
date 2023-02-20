import React from "react";

const Message = () => {
  const owner = false;
  return (
    <div className={`flex gap-4 ${owner ? "flex-row-reverse" : "flex-row"}`}>
      <div className="flex flex-col">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Slika profila"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-500 text-xs">just now</span>
      </div>
      <div
        className={`flex flex-col max-w-[70%] ${
          owner ? "items-end" : "items-start"
        }`}
      >
        <p
          className={`${
            owner
              ? "bg-teal-500 text-white rounded-tr-none"
              : "bg-white rounded-tl-none"
          } rounded-md p-1.5 mb-2`}
          style={{ maxWidth: "max-content" }}
        >
          Hello
        </p>
        <img
          src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80"
          alt=""
          className={`h-[18rem] w-[18rem] rounded-md ${
            owner ? "rounded-tr-none" : "rounded-tl-none"
          }`}
        />
      </div>
    </div>
  );
};

export default Message;
