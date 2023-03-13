// react imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import ChatPage from "./Chat/ChatPage";
import MessagesPage from "./Chat/MessagesPage";

// library imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/messages" element={<MessagesPage />} />
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
