import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    sessionStorage.removeItem("Auth Token");
    navigate("/prijava");
  };

  return (
    <header className="bg-teal-500 p-4 text-white">
      <div className="flex items-center justify-between xl:max-w-7xl xl:mx-auto max-w-full px-[8%] flex-wrap">
        <Link to="/" className="text-2xl font-semibold">
          FIDIT Buddy
        </Link>
        <FiMenu
          className="lg:hidden block h-6 w-6 cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        <nav
          className={`${open ? "block" : "hidden"} w-full lg:flex lg:w-auto`}
        >
          <ul className="text-base lg:flex lg:justify-between lg:items-center text-center">
            <li>
              <Link to="/" className="lg:px-5 py-2 block  hover:font-semibold">
                Naslovna
              </Link>
            </li>
            <li>
              <Link
                to="/poruke"
                className="lg:px-5 py-2 block  hover:font-semibold"
              >
                Poruke
              </Link>
            </li>
            <li>
              <Link
                to="/kreiraj-objavu"
                className="lg:px-5 py-2 block  hover:font-semibold"
              >
                Kreiraj Objavu
              </Link>
            </li>
            <li>
              <Link
                to="/profil"
                className="lg:px-5 py-2 block  hover:font-semibold"
              >
                Profil
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="lg:px-5 py-2 block w-full text-teal-500 bg-white rounded-lg hover:font-semibold"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
