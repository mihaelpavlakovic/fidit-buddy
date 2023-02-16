import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Homepage from "./Homepage";
import PasswordReset from "./PasswordReset";
import PrivateRoutes from "./PrivateRoutes";
import Messages from "./Messages";
import Profile from "./Profile";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/poruke" element={<Messages />} />
          <Route path="/profil" element={<Profile />} />
        </Route>
        <Route path="/prijava" element={<Login />} />
        <Route path="/registracija" element={<Registration />} />
        <Route path="/promjena-lozinke" element={<PasswordReset />} />
      </Routes>
    </>
  );
}

export default App;
