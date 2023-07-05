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
} from "firebase/firestore";

const galleryRef = collection(db, "gallery");

const addToGallery = async (payload) => {
  await addDoc(galleryRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
};

const getPhotoGallery = async (sort, search, page, perPage) => {
  try {
    let collectionRef = query(galleryRef, orderBy("createdAt", sort));
    
    if (search) {
      // Menambahkan kondisi pencarian menggunakan 'where' dari Firestore
      collectionRef = query(collectionRef, where("captions", "==", search), where("desc", "==", search));
    }
    
    const snapshot = await getDocs(collectionRef);
    const docs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    // Menghitung indeks awal dan akhir foto pada halaman saat ini
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    // Mengambil foto yang sesuai dengan halaman yang ditentukan
    const paginatedPhotos = docs.slice(startIndex, endIndex);

    return paginatedPhotos;
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
