import PostComments from "./PostComments";

const Post = ({ postDetail }) => {
  return (
    <div className="sm: w-full md:w-5/6 lg:w-2/3 px-10 py-5 shadow-lg mx-auto my-8 drop-shadow-md">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 text-sm">
            <img
              className="w-11 h-11 rounded-md"
              src={postDetail.user.photoUrl}
              alt="Slika profila student-mentora"
            />
            <div className="flex flex-col justify-start">
              <h3 className="text-md font-semibold">{postDetail.user.name}</h3>
              <p className="text-gray-500">{postDetail.user.email}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-end">
            <p>{postDetail.createdDate}</p>
            <p>{postDetail.createdTime}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{postDetail.postTitle}</h2>
        </div>
        <p className="text-gray-500 mb-2">{postDetail.postText}</p>
        <div>
          {!postDetail.comments
            ? "Nema komentara..."
            : postDetail.comments.map((item, index) => {
                return <PostComments key={index} comments={item} />;
              })}
        </div>
        <form className="flex flex-col md:flex-row items-center gap-3">
          <textarea
            className="w-full md:w-4/6 p-2 text-gray-500 border-2 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
            rows="3"
            type="text"
            placeholder="Napiši svoj komentar"
          ></textarea>
          <button className="w-full md:w-2/6 bg-teal-500 text-sm text-white py-3 rounded-lg w-full hover:bg-teal-600 hover:font-semibold">
            Objavi komentar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
