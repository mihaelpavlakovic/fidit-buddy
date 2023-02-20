import { Outlet, Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const PrivateRoutes = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <Outlet /> : <Navigate to={"/prijava"} replace />;
};

export default PrivateRoutes;
