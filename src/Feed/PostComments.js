import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BiEdit, BiTrash } from "react-icons/bi";

const PostComments = ({ comments, onDeleteHandler, onEditHandler }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="w-full bg-gray-100 p-2 sm:px-4 flex gap-3 mb-2">
      <img
        className="w-8 h-8 rounded-md"
        src={comments.user.photoURL}
        alt="Profilna slika korisnika"
      />
      <div className="w-full">
        <div className="flex items-start flex-nowrap">
          <h3 className="flex-auto font-semibold">
            {comments.user.displayName}
            {comments.user.isMentor && (
              <span className="text-xs font-normal ml-2 bg-gray-200 px-2 py-1 rounded-full">
                mentor
              </span>
            )}
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
                <button
                  onClick={onEditHandler}
                  className="pt-1.5 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-600 duration-300"
                >
                  <BiEdit className="text-[14px] mr-2" />
                </button>
                <button
                  onClick={onDeleteHandler}
                  className="pt-1.5 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-600 duration-300"
                >
                  <BiTrash className="text-[14px]" />
                </button>
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
