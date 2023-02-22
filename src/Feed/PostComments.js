const PostComments = ({ comments }) => {
  return (
    <div className="w-full bg-gray-100 py-2 px-4 flex gap-3 mb-2">
      <img
        className="w-7 h-7 rounded-md mt-1"
        src={comments.user.photoURL}
        alt="Profilna slika korisnika"
      />
      <div className="w-full pr-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm flex flex-col sm:flex-row">
            {comments.user.displayName}
            {comments.user.studentMentor && (
              <span className="text-xs font-normal mt-1 sm:mt-0 sm:ml-2 bg-gray-200 px-2 rounded-full">
                student-mentor
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {comments.commentCreatedDate} - {comments.commentCreatedTime}
          </p>
        </div>
        <p className="text-gray-500 mt-1">{comments.comment}</p>
      </div>
    </div>
  );
};

export default PostComments;
