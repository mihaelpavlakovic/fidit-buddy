// react imports
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";

// redux imports
import { useSelector } from "react-redux";

// firebase imports
import { db, auth } from "../database/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoutes = ({ isAdminRoute, isMentorRoute }) => {
  const stateUser = useSelector(state => state.user.userData);
  console.log(stateUser);
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
    return stateUser ? (
      !!isAdminRoute === userIsAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to="/prijava" />
    );
  } else if (!!isMentorRoute) {
    return stateUser ? (
      !!isMentorRoute === userIsMentor ? (
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
