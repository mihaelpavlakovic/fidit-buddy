const PostComments = props => {
  let postComments = props.comments;
  return (
    <div className="w-full bg-gray-100 py-2 px-4 flex gap-3 mb-2">
      <img
        className="w-7 h-7 rounded-md mt-1"
        src={postComments.user.photoUrl}
        alt="Profilna slika korisnika"
      />
      <div className="w-full pr-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">{postComments.user.name}</p>
          <p className="text-xs text-gray-500">
            {postComments.commentCreatedDate} -{" "}
            {postComments.commentCreatedTime}
          </p>
        </div>
        <p className="text-gray-500 mt-1">{postComments.comment}</p>
      </div>
    </div>
  );
};

export default PostComments;
