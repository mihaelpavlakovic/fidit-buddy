import React from "react";
import Chats from "./Chats";
import Search from "./Search";

const Sidebar = () => {
  return (
    <div className="flex-1 w-1/3 bg-gray-400">
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
