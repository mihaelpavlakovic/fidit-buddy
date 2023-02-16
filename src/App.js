import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Login from "./Login";
import Registration from "./Registration";
import Homepage from "./Homepage";
import PasswordReset from "./PasswordReset";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/prijava" element={<Login />} />
        <Route path="/registracija" element={<Registration />} />
        <Route path="/promjena-lozinke" element={<PasswordReset />} />
      </Routes>
    </>
  );
}

export default App;
