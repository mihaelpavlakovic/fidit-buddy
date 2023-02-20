import React from "react";

const Chats = () => {
  return (
    <div>
      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-500">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Slika profila"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-semibold">Jane</span>
          <p className="text-xs text-gray-600">Hello</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-500">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Slika profila"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-semibold">Jane</span>
          <p className="text-xs text-gray-600">Hello</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;
