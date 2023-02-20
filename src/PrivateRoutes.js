import { Outlet, Navigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoutes = ({ isAdmin }) => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        localStorage.setItem("isAdmin", snapshot.data().isAdmin);
      }
    });
  }, []);

  if (isAdmin) {
    return currentUser ? (
      isAdmin === localStorage.getItem("isAdmin") ? (
        <Outlet />
      ) : (
        <Navigate to="/odbijen-pristup" />
      )
    ) : (
      <Navigate to="/prijava" />
    );
  } else {
    return currentUser ? <Outlet /> : <Navigate to={"/prijava"} replace />;
  }
};

export default PrivateRoutes;
