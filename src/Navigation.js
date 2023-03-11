import { useState, useCallback, useEffect, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "./context/AuthContext";

const Navigation = () => {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const { currentUser } = useContext(AuthContext);

	const userData = useCallback(async () => {
		if (currentUser && currentUser.uid) {
			const docRef = doc(db, "users", currentUser.uid);
			const docSnap = await getDoc(docRef);

			const data = docSnap.exists() ? setUser(docSnap.data()) : null;

			if (data === null || data === undefined) return null;
		}
	}, [currentUser]);

	useEffect(() => {
		if (currentUser) {
			userData();
		}
	}, [userData, currentUser]);

	const userNav = (
		<>
			<li>
				<Link
					to="/"
					className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
				>
					Naslovna
				</Link>
			</li>
			<li>
				<Link
					to="/poruke"
					className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
				>
					Poruke
				</Link>
			</li>
			<li>
				<Link
					to="/chat"
					className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
				>
					Chat
				</Link>
			</li>
			{user?.isMentor && (
				<li>
					<Link
						to="/kreiraj-objavu"
						className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
					>
						Kreiraj Objavu
					</Link>
				</li>
			)}
			<li>
				<Link
					to="/profil"
					className="lg:px-5 py-1 block hover:border-b-4 border-white ease-in-out duration-100"
				>
					Profil
				</Link>
			</li>
		</>
	);
	return (
		<header className="bg-teal-500 p-4 text-white">
			<div className="flex items-center justify-between xl:max-w-7xl xl:mx-auto max-w-full px-[8%] flex-wrap">
				<Link to="/" className="text-2xl font-semibold">
					FIDIT Buddy
				</Link>
				<FiMenu
					className="lg:hidden block h-8 w-8 my-1 cursor-pointer"
					onClick={() => setOpen(!open)}
				/>
				<nav
					className={`${open ? "block" : "hidden"} w-full lg:flex lg:w-auto`}
				>
					<ul className="text-base lg:flex lg:justify-between lg:items-center text-center">
						{user?.isAdmin ? (
							<li>
								<Link
									to="/admin"
									className="lg:px-5 py-2 block hover:font-semibold"
								>
									Admin Ploča
								</Link>
							</li>
						) : (
							userNav
						)}
						<li>
							<button
								onClick={() => {
									signOut(auth);
								}}
								className="lg:px-5 ml-1 py-2 block w-full text-teal-500 bg-white rounded-lg hover:bg-gray-200"
							>
								Logout
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Navigation;
