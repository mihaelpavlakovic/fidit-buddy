import { useNavigate, useLocation } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const logoutHandler = () => {
    sessionStorage.removeItem("Auth Token");
    navigate("/prijava");
  };
  return (
    <div>
      <div>
        <p>Logged in as {state.email}</p>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Homepage;
