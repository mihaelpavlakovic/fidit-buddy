import React from "react";

const Search = () => {
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Unesite naziv osobe..."
          className="w-full bg-gray-400 placeholder-white h-10 p-3 outline-none"
        />
      </div>
      <div className="flex items-center gap-3 p-3 cursor-pointer border-b border-solid border-white hover:bg-gray-500">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Slika profila"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold">Jane</span>
      </div>
    </div>
  );
};

export default Search;
