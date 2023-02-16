import Navigation from "../Navigation";
import Post from "./Post";
import posts from "./posts";

const Homepage = () => {
  return (
    <>
      <Navigation />
      <main className="md:w-5/6 mx-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl mt-5 font-semibold">
            Dobro došli studenti! 👋
          </h1>
          {posts.map((item, index) => {
            return <Post key={index} postDetail={item} />;
          })}
        </div>
      </main>
    </>
  );
};

export default Homepage;
