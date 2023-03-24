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

// library imports
import { toast } from "react-toastify";

export const login = ({ email, password }) => {
  return async dispatch => {
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        await signInWithEmailAndPassword(auth, email, password);
        dispatch(userActions.LOGIN({ authToken: auth.currentUser.toJSON() }));
        dispatch(getUser());
      })
      .catch(error => console.log(error));
  };
};

export const logout = () => {
  return dispatch => {
    signOut(auth)
      .then(() => {
        dispatch(userActions.logout());
        toast.success("Uspješno ste odjavljeni");
      })
      .catch(error => toast.error(error.msg));
  };
};

export const getUser = user => {
  return async (dispatch, state) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const fetchedUserData = docSnap.exists() ? docSnap.data() : null;

    if (fetchedUserData !== state().user.userData) {
      let userData = {
        ...fetchedUserData,
      };

      dispatch(userActions.setUserData({ userData }));
    }
  };
};
