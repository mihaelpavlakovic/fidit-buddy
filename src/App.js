import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Homepage from "./Feed/Homepage";
import PasswordReset from "./PasswordReset";
import PrivateRoutes from "./PrivateRoutes";
import MessagesPage from "./Messages/MessagesPage";
import Profile from "./Profile";
import CreatePost from "./CreatePost";
import Admin from "./Admin";
import PermissionDenied from "./PermissionDenied";

function App() {
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
          <Route path="/poruke" element={<MessagesPage />} />
          <Route path="/profil" element={<Profile />} />
        </Route>
        <Route path="/prijava" element={<Login />} />
        <Route path="/registracija" element={<Registration />} />
        <Route path="/promjena-lozinke" element={<PasswordReset />} />
        <Route path="/odbijen-pristup" element={<PermissionDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
