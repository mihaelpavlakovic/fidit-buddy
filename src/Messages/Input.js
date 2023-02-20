import React from "react";
import { IoIosAttach } from "react-icons/io";
import { RiImageAddLine } from "react-icons/ri";
import { FiSend } from "react-icons/fi";

const Input = () => {
  return (
    <div className="h-10 bg-white flex items-center justify-between">
      <input
        type="text"
        placeholder="Vaša poruka..."
        className="w-full h-full p-3 outline-none"
      />
      <div className="flex items-center gap-2">
        <IoIosAttach className="cursor-pointer" />
        <input type="file" id="file" className="hidden" />
        <label htmlFor="file">
          <RiImageAddLine className="cursor-pointer" />
        </label>
        <button className="bg-teal-500 text-white p-3 hover:bg-teal-400">
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Input;
