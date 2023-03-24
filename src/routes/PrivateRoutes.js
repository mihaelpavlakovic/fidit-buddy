// react imports
import { Outlet, Navigate } from "react-router";

// redux imports
import { useSelector } from "react-redux";

const PrivateRoutes = ({ isAdminRoute, isMentorRoute }) => {
  const stateUser = useSelector(state => state.user.userData);

  if (!!isAdminRoute) {
    return stateUser ? (
      !!isAdminRoute === stateUser.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to="/prijava" />
    );
  } else if (!!isMentorRoute) {
    return stateUser ? (
      !!isMentorRoute === stateUser.isMentor ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to={"/prijava"} replace />
    );
  } else {
    return stateUser ? <Outlet /> : <Navigate to={"/prijava"} replace />;
  }
};

export default PrivateRoutes;
