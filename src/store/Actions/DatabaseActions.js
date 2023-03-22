// redux imports
import { databaseActions } from "../Reducers/DatabaseReducers";

// firebase imports
import { db, storage } from "../../database/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  deleteDoc,
  arrayRemove,
  updateDoc,
  where,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

// library imports
import { toast } from "react-toastify";

const getAllPostsFromMentor = userDocRef => {
  const q = query(
    collection(db, "posts"),
    where("user", "==", userDocRef),
    orderBy("createdAt", "desc")
  );
  return q;
};

const serializeTimestamp = timestamp => ({
  seconds: timestamp.seconds,
  nanoseconds: timestamp.nanoseconds,
});

export const getAllPostsAction = userDocRef => {
  return async dispatch => {
    const q = getAllPostsFromMentor(userDocRef);

    const unsubscribe = onSnapshot(q, snapshot => {
      let posts = [];
      snapshot.forEach(doc => {
        const postData = doc.data();
        const createdAt = serializeTimestamp(postData.createdAt);
        let post = {
          docId: doc.id,
          ...postData,
          createdAt: new Date(
            createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
          ).toLocaleString("hr-HR", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        };

        if (postData.user) {
          getDoc(postData.user).then(userDoc => {
            const userInfo = userDoc.data();
            const updatedPost = {
              ...post,
              user: userInfo,
            };
            post = updatedPost;
            if (postData.comments) {
              Promise.all(
                postData.comments.map(comment =>
                  getDoc(comment.user).then(doc => doc.data())
                )
              ).then(commentUsers => {
                const createdAt = serializeTimestamp(postData.createdAt);
                const comments = postData.comments.map((comment, index) => ({
                  ...comment,
                  createdAt: new Date(
                    createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
                  ).toLocaleString("hr-HR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }),
                  user: commentUsers[index],
                }));
                post = { ...post, comments };
                posts = [...posts, post];
                dispatch(databaseActions.setPosts(posts));
              });
            } else {
              posts = [...posts, post];
              dispatch(databaseActions.setPosts(posts));
            }
          });
        }
      });
    });
    return unsubscribe;
  };
};

export const createPostAction = postData => {
  return async () => {
    const response = await addDoc(collection(db, "posts"), postData);

    if (response.ok) {
      toast.success("Objava uspjeŠno kreirana");
    }
  };
};

export const deletePostAction = (postId, postDetail) => {
  return async () => {
    const docRef = doc(db, "posts", postId);
    Object.entries(postDetail.data).forEach(item => {
      let documentRef = ref(storage, item[1].documentURL);
      deleteObject(documentRef);
    });

    await deleteDoc(docRef)
      .then(() => toast.success("Objava uspješno izbrisana"))
      .catch(() =>
        toast.error("Došlo je do pogreške prilikom brisanja objave")
      );
  };
};

export const deleteCommentAction = (comIndex, docId) => {
  return async () => {
    const docRef = doc(db, "posts", docId);
    const docForDelete = await getDoc(docRef).then(doc => doc.data());

    await updateDoc(docRef, {
      comments: arrayRemove(docForDelete.comments[comIndex]),
    })
      .then(() => {
        toast.success("Komentar je uspješno obrisan");
      })
      .catch(() => {
        toast.error("Došlo je do pogreške prilikom brisanja komentara.");
      });
  };
};
