import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PostComments = ({ comments, onDelete }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="w-full bg-gray-100 p-2 sm:px-4 flex gap-3 mb-2">
      <img
        className="w-8 h-8 rounded-md"
        src={comments.user.photoURL}
        alt="Profilna slika korisnika"
      />
      <div className="w-full">
        <div className="flex items-center flex-nowrap">
          <h3 className="flex-auto font-semibold">
            {comments.user.displayName}
            {comments.user.studentMentor && (
              <span className="text-xs font-normal ml-2 bg-gray-200 px-2 py-1 rounded-full">
                mentor
              </span>
            )}
          </h3>
          <div className="text-xs text-gray-500 text-right">
            <div>
              {comments.commentCreatedDate} - {comments.commentCreatedTime}
            </div>
            {currentUser.uid === comments.user.uid && (
              <button onClick={onDelete}>Izbriši</button>
            )}
          </div>
        </div>
        <p className="text-gray-500 mt-1">{comments.comment}</p>
      </div>
    </div>
  );
};

export default PostComments;
