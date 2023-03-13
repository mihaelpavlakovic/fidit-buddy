// react imports
import { useState, useCallback, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

// component imports
import Button from "../utils/Button";

// firebase imports
import { db, auth } from "../database/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// context imports
import { AuthContext } from "../context/AuthContext";

// library imports
import { FiMenu } from "react-icons/fi";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const userData = useCallback(async () => {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const data = docSnap.exists() ? setUser(docSnap.data()) : null;

      if (data === null || data === undefined) return null;
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      userData();
    }
  }, [userData, currentUser]);

  const userNav = (
    <>
      <li>
        <Link
          to="/"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          Naslovna
        </Link>
      </li>
      <li>
        <Link
          to="/poruke"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          Poruke
        </Link>
      </li>
      <li>
        <Link
          to="/chat"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          Chat
        </Link>
      </li>
      {user?.isMentor && (
        <li>
          <Link
            to="/kreiraj-objavu"
            className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
          >
            Kreiraj Objavu
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/profil"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          Profil
        </Link>
      </li>
    </>
  );
  return (
    <header className="bg-teal-500 p-4 text-white">
      <div className="flex items-center justify-between xl:max-w-7xl xl:mx-auto max-w-full px-[8%] flex-wrap">
        <Link to="/" className="text-2xl font-semibold">
          FIDIT Buddy
        </Link>
        <FiMenu
          className="lg:hidden block h-8 w-8 my-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        <nav
          className={`${open ? "block" : "hidden"} w-full lg:flex lg:w-auto`}
        >
          <ul className="text-base lg:flex lg:justify-between lg:items-center text-center">
            {user?.isAdmin ? (
              <li>
                <Link
                  to="/admin"
                  className="lg:px-5 py-2 block hover:font-semibold"
                >
                  Admin Ploča
                </Link>
              </li>
            ) : (
              userNav
            )}
            <li>
              <Button
                text="Odjavi se"
                btnAction="button"
                btnType="secondary"
                addClasses="lg:px-5 ml-1 py-2 block w-full"
                onClick={() => signOut(auth)}
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
