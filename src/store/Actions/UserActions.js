// redux imports
import { userActions } from "../Reducers/UserReducers";

// fireabse imports
import { auth, db } from "../../database/firebase";
import {
  browserLocalPersistence,
  signInWithEmailAndPassword,
  setPersistence,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// library imports
import { toast } from "react-toastify";

export const setAuthListener = () => {
  return (dispatch, state) => {
    onAuthStateChanged(auth, user => {
      if (user && !state().user.initialized) {
        dispatch(userActions.login({ user: auth.currentUser.toJSON() }));
        dispatch(getUser());
      }
      !state().user.initialized && dispatch(userActions.initialized(true));
    });
  };
};

export const login = ({ email, password }) => {
  return async dispatch => {
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        await signInWithEmailAndPassword(auth, email, password);

        dispatch(userActions.login({ user: auth.currentUser.toJSON() }));
        dispatch(getUser());
      })
      .catch(error => console.log(error));
  };
};

export const logout = () => {
  return async dispatch => {
    await signOut(auth)
      .then(() => toast.success("Uspješno ste odjavljeni"))
      .catch(error => toast.error(error.msg));
    dispatch(userActions.logout());
  };
};

export const getUser = () => {
  return async dispatch => {
    let user = null;
    const uid = auth.currentUser.uid;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const fetchedUserData = docSnap.exists() ? docSnap.data() : null;

    user = {
      ...fetchedUserData,
    };

    dispatch(userActions.setUserData({ user }));
  };
};
