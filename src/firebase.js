import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLYthExsftWlCx08ewuWIrskpYF2uPyEY",
  authDomain: "fidit-buddy.firebaseapp.com",
  projectId: "fidit-buddy",
  storageBucket: "fidit-buddy.appspot.com",
  messagingSenderId: "21761665680",
  appId: "1:21761665680:web:73510d650b073ded414615",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };
