// react imports
import React from "react";
import { Link } from "react-router-dom";

const PermissionDenied = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="mb-3 text-2xl font-semibold text-center">
        Pristup odbijen.
        <br /> Nemate dodijeljenje ovlasti za tražene radnje.
      </p>
      <Link
        className="bg-teal-500 text-sm text-white px-10 py-3 rounded-lg hover:bg-teal-600"
        to="/"
      >
        Povratak
      </Link>
    </div>
  );
};

export default PermissionDenied;
