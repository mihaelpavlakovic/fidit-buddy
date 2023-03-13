// react imports
import { useContext, useState } from "react";

// component imports
import Button from "./Button";

// firebase imports
import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// library imports
import { toast } from "react-toastify";

// context imports
import { AuthContext } from "../context/AuthContext";

const EditModal = ({ onClose, user }) => {
  const [displayName, setDisplayName] = useState(user?.displayName);
  const { currentUser } = useContext(AuthContext);

  const newDisplayName = e => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const docRef = doc(db, "users", currentUser.uid);

    await updateProfile(currentUser, {
      displayName: displayName,
    });

    await updateDoc(docRef, {
      displayName: displayName,
    })
      .then(() => {
        toast.success("Uspješno ste promijenili ime");
        onClose();
      })
      .catch(() => {
        toast.error("Došlo je do pogreške pri promjeni imena");
      });
  };

  return (
    <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-12 mx-7 w-full sm:w-1/2 lg:w-1/3 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">Promjenite svoje ime:</h2>
        <form onSubmit={handleSubmit} className="text-gray-700">
          <div className="mt-4">
            <div className="pb-4">
              <label htmlFor="displayName" className="block text-sm pb-2">
                Vaše ime:
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
            <Button
              text="Ažuriraj"
              btnAction="submit"
              btnType="primary"
              addClasses="py-3 mt-2.5 w-full"
            />
            <Button
              text="Odustani"
              btnAction="button"
              btnType="secondary"
              addClasses="py-3 mt-2.5 w-full"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
