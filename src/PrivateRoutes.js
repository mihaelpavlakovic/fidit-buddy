import { Outlet, Navigate } from "react-router";

const PrivateRoutes = () => {
  let auth = { token: false };
  if (sessionStorage.getItem("Auth Token")) {
    auth = { token: true };
  }
  return auth.token ? <Outlet /> : <Navigate to={"/prijava"} />;
};

export default PrivateRoutes;
