import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    sessionStorage.removeItem("Auth Token");
    navigate("/prijava");
  };

  return (
    <nav className="flex items-center justify-end flex-wrap bg-teal-500 p-6 text-white">
      <ul className="flex gap-x-5">
        <li>
          <Link to="/">Naslovna</Link>
        </li>
        <li>
          <Link to="/poruke">Poruke</Link>
        </li>
        <li>
          <Link to="/profil">Profil</Link>
        </li>
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
