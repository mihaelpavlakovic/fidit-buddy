import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCLYthExsftWlCx08ewuWIrskpYF2uPyEY",
  authDomain: "fidit-buddy.firebaseapp.com",
  projectId: "fidit-buddy",
  storageBucket: "fidit-buddy.appspot.com",
  messagingSenderId: "21761665680",
  appId: "1:21761665680:web:73510d650b073ded414615",
};

const app = initializeApp(firebaseConfig);
export default app;