import { Outlet, Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoutes = ({ isAdminRoute, isMentorRoute }) => {
  const { currentUser } = useContext(AuthContext);
  const [userIsAdmin, setUserIsAdmin] = useState(true);
  const [userIsMentor, setUserIsMentor] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        setUserIsAdmin(snapshot.data().isAdmin);
        setUserIsMentor(snapshot.data().isMentor);
      }
    });
  }, []);

  if (!!isAdminRoute) {
    return currentUser ? (
      !!isAdminRoute === userIsAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to="/prijava" />
    );
  } else if (!!isMentorRoute) {
    return currentUser ? (
      !!isMentorRoute === userIsMentor ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to={"/prijava"} replace />
    );
  } else {
    return currentUser ? <Outlet /> : <Navigate to={"/prijava"} replace />;
  }
};

export default PrivateRoutes;
