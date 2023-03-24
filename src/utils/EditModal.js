// react imports
import { useState } from "react";

// redux imports
import { useDispatch } from "react-redux";
import {
  updateCommentAction,
  updatePostAction,
} from "../store/Actions/DatabaseActions";
import { userActions } from "../store/Reducers/UserReducers";
import { getUser } from "../store/Actions/UserActions";

// component imports
import Button from "./Button";

// firebase imports
import { auth, db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// library imports
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Modal = ({
  handleCloseModal,
  modalType,
  modalTitle,
  submitBtnText,
  comment = "",
  comIndex = "",
  docId = "",
  docFromDb = "",
  user = "",
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [commentValue, setCommentValue] = useState(comment);
  const [postTitleValue, setPostTitleValue] = useState(docFromDb.postTitle);
  const [postTextValue, setPostTextValue] = useState(docFromDb.postText);
  const [displayName, setDisplayName] = useState(user?.displayName);

  const newDisplayName = e => {
    setDisplayName(e.target.value);
  };

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
    if (modalType === "editComment") {
      dispatch(updateCommentAction(docId, comIndex, commentValue)).then(() => {
        handleCloseModal();
      });
    } else if (modalType === "editPost") {
      dispatch(updatePostAction(docId, postTitleValue, postTextValue)).then(
        () => {
          handleCloseModal();
        }
      );
    } else {
      const docRef = doc(db, "users", user.uid);

      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      await updateDoc(docRef, {
        displayName: displayName,
      })
        .then(() => {
          dispatch(userActions.LOGIN({ authToken: auth.currentUser.toJSON() }));
          dispatch(getUser(user));
          toast.success("Uspješno ste promijenili ime");
          handleCloseModal();
        })
        .catch(() => {
          toast.error("Došlo je do pogreške pri promjeni imena");
        });
    }
  };

  return (
    <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-12 mx-7 w-full sm:w-1/2 lg:w-1/3 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">{modalTitle}:</h2>
        <form onSubmit={handleSubmit} className="text-gray-700">
          <div className="mt-4">
            {modalType === "editUser" && (
              <div className="pb-4">
                <label htmlFor="displayName" className="block text-sm pb-2">
                  {t("Modal.yourName")}:
                </label>

                <input
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                  type="text"
                  name="displayName"
                  placeholder="Unesi novo ime..."
                  value={displayName}
                  onChange={newDisplayName}
                />
              </div>
            )}
            {modalType === "editComment" && (
              <div className="pb-4">
                <label htmlFor="comment" className="block text-sm pb-2">
                  {t("Modal.yourComment")}:
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
            {modalType === "editPost" && (
              <>
                <div className="pb-4">
                  <label htmlFor="postTitle" className="block text-sm pb-2">
                    {t("Modal.postName")}:
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
                    {t("Modal.postDescription")}:
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
            <Button
              text={submitBtnText}
              btnAction="submit"
              btnType="primary"
              addClasses="py-3 mt-2.5 w-full"
            />
            <Button
              text={t("Buttons.cancel")}
              btnAction="button"
              btnType="secondary"
              addClasses="py-3 mt-2.5 w-full"
              onClick={handleCloseModal}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
