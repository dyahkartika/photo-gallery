import { db } from "./firebase.js";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  serverTimestamp,
  query,
  updateDoc,
  deleteDoc,
  where,
  startAfter,
  limit
} from "firebase/firestore";

const galleryRef = collection(db, "gallery");

const addToGallery = async (payload) => {
  await addDoc(galleryRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
};

const getPhotoGallery = async (sort, search, page) => {
  try {
    let collectionRef = query(galleryRef, orderBy("createdAt", sort));

    if (search) {
      // Menambahkan kondisi pencarian menggunakan 'where' dari Firestore
      collectionRef = query(
        collectionRef,
        where("captions", "==", search),
        where("desc", "==", search)
      );
    }

    const displayPerPage = 5;
    const querySnapshot = await getDocs(collectionRef);
    const docs = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    let paginatedQuery = collectionRef;

    if (page > 1) {
      const lastDoc = docs[docs.length - 1];
      paginatedQuery = query(collectionRef, startAfter(lastDoc));
    }

    const paginatedSnapshot = await getDocs(limit(paginatedQuery, displayPerPage));
    const paginatedDocs = paginatedSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return paginatedDocs;
  } catch (error) {
    return [];
  }
};



const getPhotoByID = async (id) => {
  const docRef = doc(db, "gallery", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) throw new Error("Cannot find photo");
  return snapshot.data();
};

const updatePhoto = async (id, payloads) => {
  const docRef = doc(db, "gallery", id);
  await updateDoc(docRef, {...payloads, updatedAt : serverTimestamp()});
};

const deletePhoto = async (id) => {
  return await deleteDoc(doc(db, "gallery", id));
};

export {
  addToGallery,
  getPhotoGallery,
  deletePhoto,
  getPhotoByID,
  updatePhoto,
};

