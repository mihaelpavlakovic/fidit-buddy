// react imports
import { useState } from "react";

// firebase imports
import { db } from "../database/firebase";
import { updateDoc, getDoc, doc } from "firebase/firestore";

const Modal = ({ onClose, comment, comIndex, docId, docFromDb }) => {
  const [commentValue, setCommentValue] = useState(comment);
  const [postTitleValue, setPostTitleValue] = useState(docFromDb.postTitle);
  const [postTextValue, setPostTextValue] = useState(docFromDb.postText);

  const newCommentValue = e => {
    setCommentValue(e.target.value);
  };
  const newPostTitleValue = e => {
    setPostTitleValue(e.target.value);
  };
  const newPostTextValue = e => {
    setPostTextValue(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const docRef = doc(db, "posts", docId);
    if (comIndex !== "") {
      const comForChange = await getDoc(docRef).then(
        doc => doc.data().comments
      );
      let updatedComments = [];

      comForChange.forEach(comment => {
        updatedComments.push({
          ...comment,
        });
      });
      updatedComments[comIndex].comment = commentValue;

      await updateDoc(docRef, {
        comments: updatedComments,
      })
        .then(() => {
          onClose();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      await updateDoc(docRef, {
        postTitle: postTitleValue,
        postText: postTextValue,
      })
        .then(() => {
          onClose();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-12 mx-7 w-full sm:w-1/2 lg:w-1/3 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">Uredite svoj komentar:</h2>
        <form onSubmit={handleSubmit} className="text-gray-700">
          <div className="mt-4">
            {comIndex !== "" && (
              <div className="pb-4">
                <label htmlFor="comment" className="block text-sm pb-2">
                  Vaš komentar:
                </label>

                <input
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                  type="text"
                  name="comment"
                  placeholder="Unesi svoj novi komentar..."
                  value={commentValue}
                  onChange={newCommentValue}
                />
              </div>
            )}
            {docFromDb !== "" && (
              <>
                <div className="pb-4">
                  <label htmlFor="postTitle" className="block text-sm pb-2">
                    Vaš naslov objave:
                  </label>

                  <input
                    className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                    type="text"
                    name="postTitle"
                    placeholder="Unesi svoj novi naslov..."
                    value={postTitleValue}
                    onChange={newPostTitleValue}
                  />
                </div>
                <div className="pb-4">
                  <label htmlFor="postText" className="block text-sm pb-2">
                    Vaš opis:
                  </label>

                  <input
                    className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                    type="text"
                    name="postText"
                    placeholder="Unesi svoj novi opis..."
                    value={postTextValue}
                    onChange={newPostTextValue}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="bg-teal-500 text-sm text-white py-3 mt-3 rounded-lg w-full hover:bg-teal-600 hover:font-semibold"
            >
              {comIndex !== "" ? "Ažuriraj komentar" : "Ažuriraj objavu"}
            </button>
            <button
              onClick={onClose}
              className="text-sm text-teal-500 py-3 mt-2.5 rounded-lg border-2 border-teal-500 w-full hover:border-teal-600 hover:font-semibold"
            >
              Odustani
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
