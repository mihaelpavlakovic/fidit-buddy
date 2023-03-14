// react imports
import { useContext } from "react";

// component imports
import Button from "../../utils/Button";

// library imports
import { BiEdit, BiTrash } from "react-icons/bi";

// context imports
import { AuthContext } from "../../context/AuthContext";

const PostComments = ({ comments, onDeleteHandler, onEditHandler }) => {
	const { currentUser } = useContext(AuthContext);
	return (
		<div className="w-full bg-gray-100 p-2 sm:px-4 flex gap-3 mb-2">
			<img
				className="w-8 h-8 rounded-md mt-1"
				src={comments.user.photoURL}
				alt="Profilna slika korisnika"
			/>
			<div className="w-full">
				<div className="flex items-start flex-nowrap">
					<h3 className="flex-auto font-semibold">
						{comments.user.displayName}
						{/* {comments.user.isMentor && (
							<span className="text-xs font-normal ml-2 bg-gray-200 px-2 py-1 rounded-full">
								mentor
							</span>
						)} */}
					</h3>
					<div className="text-xs text-gray-500 text-right">
						<div>
							{comments.createdAt
								?.toDate()
								.toLocaleDateString("hr-HR")
								.replace(/\s+/g, "")}{" "}
							-{" "}
							{comments.createdAt?.toDate().toLocaleTimeString("hr-HR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
						{currentUser.uid === comments.user.uid && (
							<>
								<Button
									text=""
									btnAction="button"
									btnType="icon"
									addClasses="pt-1.5"
									onClick={onEditHandler}
								>
									<BiEdit className="mr-2" size={15} />
								</Button>
								<Button
									text=""
									btnAction="button"
									btnType="icon"
									addClasses="pt-1.5"
									onClick={onDeleteHandler}
								>
									<BiTrash size={15} />
								</Button>
							</>
						)}
					</div>
				</div>
				<p className="text-gray-500 mt-1">{comments.comment}</p>
			</div>
		</div>
	);
};

export default PostComments;
