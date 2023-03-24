// react imports
import { useState } from "react";
import { Link } from "react-router-dom";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Actions/UserActions";

// component imports
import Button from "../utils/Button";

// library imports
import { FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const stateUser = useSelector(state => state.user.userData);

  const userNav = (
    <>
      <li>
        <Link
          to="/"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          {t("Navigation.home")}
        </Link>
      </li>
      {stateUser?.isAdmin && (
        <li>
          <Link
            to="/admin"
            className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
          >
            {t("Navigation.dashboard")}
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/poruke"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          {t("Navigation.messages")}
        </Link>
      </li>
      {stateUser?.isMentor && (
        <li>
          <Link
            to="/kreiraj-objavu"
            className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
          >
            {t("Navigation.createPost")}
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/profil"
          className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
        >
          {t("Navigation.profile")}
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
            {userNav}
            <li>
              <Button
                text={t("Buttons.logout")}
                btnAction="button"
                btnType="secondary"
                addClasses="lg:px-5 ml-1 py-2 block w-full"
                onClick={() => dispatch(logout())}
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
