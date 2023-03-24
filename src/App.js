// react imports
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// redux imports
import { useDispatch } from "react-redux";
import { userActions } from "./store/Reducers/UserReducers";

// firebase imports
import { auth } from "./database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "./store/Actions/UserActions";

// component imports
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Homepage from "./pages/Homepage/Homepage";
import PasswordReset from "./pages/PasswordReset";
import PrivateRoutes from "./routes/PrivateRoutes";
import Profile from "./pages/Profile/Profile";
import CreatePost from "./pages/CreatePost";
import Admin from "./pages/Admin/Admin";
import PermissionDenied from "./pages/PermissionDenied";
import ChatPage from "./pages/Chat/ChatPage";
import MessagesPage from "./pages/Chat/MessagesPage";

// library imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(userActions.LOGIN({ authToken: user.toJSON() }));
        dispatch(getUser(user));
      }
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<PrivateRoutes isAdminRoute="true" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route element={<PrivateRoutes isMentorRoute="true" />}>
            <Route path="/kreiraj-objavu" element={<CreatePost />} />
          </Route>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/poruke" element={<ChatPage />} />
          <Route path="/razgovor" element={<MessagesPage />} />
          <Route path="/profil" element={<Profile />} />
        </Route>
        <Route path="/prijava" element={<Login />} />
        <Route path="/registracija" element={<Registration />} />
        <Route path="/promjena-lozinke" element={<PasswordReset />} />
        <Route path="/odbijen-pristup" element={<PermissionDenied />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
