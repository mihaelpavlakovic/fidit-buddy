import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { AuthContext } from "./context/AuthContext";
import Navigation from "./Navigation";
import Feedback from "./Feedback";
import { db, storage } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [newFile, setNewFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const refValue = useRef();
  const [user, setUser] = useState(null);

  const reset = () => {
    refValue.current.value = "";
    setNewFile(null);
  };

  const handleSelect = e => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setNewFile(selected);
      setError("");
    } else {
      setNewFile(null);
      setError("Odaberite sliku formata .png, .jpeg ili .jpg");
    }
  };

  useEffect(() => {}, [newFile]);

  const uploadImage = () => {
    const storageRef = ref(storage, `${currentUser.uid}/${newFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newFile);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          await updateProfile(currentUser, {
            photoURL: downloadURL,
          });
          await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: downloadURL,
          });
        });
      }
    );

    setNewFile([]);
  };

  const userData = useCallback(async () => {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? setUser(docSnap.data()) : null;

      if (data === null || data === undefined) return null;
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      userData();
    }
  }, [userData, currentUser]);
  console.log(user?.isMentor);
  return (
    <>
      <Navigation />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full m-5 sm:px-[8%]">
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl mb-5 font-semibold">Postavke korisnika</h1>
          <div className="border-2 border-solid rounded-md">
            <p className="text-lg p-3 border-b-2">Slika profila</p>
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 flex items-center justify-center">
                <img
                  className="p-3 lg:w-[70%]"
                  src={currentUser.photoURL}
                  alt="Slika profila"
                />
              </div>
              <form className="flex-1 p-3 w-full">
                <label
                  htmlFor="fileInput"
                  className="block text-sm mb-4 flex items-center"
                >
                  Odaberite novu sliku profila:
                </label>
                <input
                  type="file"
                  ref={refValue}
                  name="fileInput"
                  onChange={handleSelect}
                  className="w-full text-sm sm:text-md"
                />
                {error && (
                  <p className="bg-red-500 text-white rounded p-2 mt-2 text-sm">
                    {error}
                  </p>
                )}
                {newFile && (
                  <div className="flex flex-col mt-3">
                    <progress
                      className="w-full h-2"
                      value={progress}
                      min="0"
                      max="100"
                    />
                    <div className="mt-3 flex flex-col md:flex-row justify-between">
                      <button
                        className="mr-2 w-full text-teal-500 text-sm rounded-lg border-2 border-teal-500 border-solid p-1 mt-2 hover:bg-teal-600 hover:font-semibold hover:text-white"
                        type="button"
                        onClick={uploadImage}
                      >
                        Upload
                      </button>
                      <button
                        className="w-full text-red-500 text-sm rounded-lg border-2 border-red-500 border-solid p-1 mt-2 hover:bg-red-500 hover:font-semibold hover:text-white"
                        type="button"
                        onClick={reset}
                      >
                        Ukloni sliku
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          {!user?.isMentor && <Feedback user={user} />}
        </div>
      </main>
    </>
  );
};

export default Profile;
