// react imports
import { useContext, useEffect, useCallback, useState, useRef } from "react";

// component imports
import Navigation from "../../components/Navigation";
import Feedback from "./Feedback";
import Button from "../../utils/Button";
import EditNameModal from "../../utils/EditNameModal";

// firebase imports
import { db, storage } from "../../database/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// library imports
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";

// context imports
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [newFile, setNewFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const refValue = useRef();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const reset = () => {
    refValue.current.value = "";
    setNewFile(null);
  };

  const handleClose = () => setShowModal(false);

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
        toast.error("Došlo je do pogreške pri učitavanju slike u bazu");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          await updateProfile(currentUser, {
            photoURL: downloadURL,
          });
          await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: downloadURL,
          });
          toast.success("Slika profila uspješno ažurirana");
          setNewFile(null);
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
  }, [userData, currentUser, currentUser.displayName]);

  return (
    <>
      <Navigation />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full m-5 sm:px-[8%]">
        {showModal && <EditNameModal onClose={handleClose} user={user} />}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl mb-5 font-semibold">Postavke korisnika</h1>
          <div className="border-2 border-solid rounded-md">
            <p className="text-lg p-3 border-b-2">Slika profila</p>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full flex items-center justify-center">
                <img
                  className="p-3 lg:w-[70%]"
                  src={currentUser.photoURL}
                  alt="Slika profila"
                />
              </div>
              <form className="p-5 w-full">
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
                    <div className="mt-3 flex flex-col gap-2 md:flex-row justify-between">
                      <Button
                        text="Učitaj"
                        btnAction="button"
                        btnType="primary"
                        addClasses="w-full p-1 mt-2"
                        onClick={uploadImage}
                      />
                      <Button
                        text="Ukloni sliku"
                        btnAction="button"
                        btnType="secondary"
                        addClasses="w-full p-1 mt-2"
                        onClick={reset}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <div className="border-2 border-solid rounded-md w-full">
              <div className="p-3 border-b-2 flex justify-between items-center">
                <h2 className="text-lg">Osobne informacije</h2>
                <Button
                  text=""
                  btnAction="button"
                  btnType="icon"
                  addClasses=""
                  onClick={() => setShowModal(true)}
                >
                  <BiEdit />
                </Button>
              </div>
              <table className="flex p-3">
                <tbody className="flex flex-col gap-1">
                  <tr>
                    <td className="w-[4.5rem]">Ime:</td>
                    <td>{user?.displayName}</td>
                  </tr>
                  <tr>
                    <td className="w-[4.5rem]">Email:</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <td className="w-[4.5rem]">JMBAG:</td>
                    <td>{user?.jmbag}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full">
              {user?.isMentor && (
                <div className="border-2 border-solid rounded-md">
                  <h2 className="text-lg p-3 border-b-2">
                    Povratne informacije
                  </h2>
                  <div className="flex flex-col items-center gap-4 my-5">
                    <p>
                      Vaša ocjena kao mentora{" "}
                      <span className="block text-center mt-3 font-semibold text-4xl">
                        {Math.round(
                          (user?.reviewMark / user?.reviewCount) * 100
                        ) / 100}
                      </span>
                    </p>
                    <p>
                      Ocjenilo vas je ukupno studenata{" "}
                      <span className="block text-center mt-3 font-semibold text-4xl">
                        {user?.reviewCount}
                      </span>
                    </p>
                    <p>Poruke od studenata</p>
                    {user?.reviewsFrom.length > 3
                      ? user?.reviewsFrom.slice(-3).map((review, i) => {
                          return (
                            <p
                              key={i}
                              className="italic text-gray-500 text-center"
                            >
                              “{review.messageFromStudent}”
                            </p>
                          );
                        })
                      : user?.reviewsFrom.map((review, i) => {
                          return (
                            <p
                              key={i}
                              className="italic text-gray-500 text-center"
                            >
                              “{review.messageFromStudent}”
                            </p>
                          );
                        })}
                  </div>
                </div>
              )}
              {!user?.isMentor && user?.assignedMentorFreshmen !== null && (
                <Feedback user={user} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
