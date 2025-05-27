import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyBcrbg_HkY153O_Jz-VRNDat3pr11Aqsw4",
  authDomain: "projeyonetimsistemi-ce231.firebaseapp.com",
  projectId: "projeyonetimsistemi-ce231",
  storageBucket: "projeyonetimsistemi-ce231.firebasestorage.app",
  messagingSenderId: "609962362602",
  appId: "1:609962362602:web:1db46019329caa49abb993",
  measurementId: "G-VEYKN6BEL1"
};

// Firebase app, auth ve firestore nesnelerini başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Varsayılan olarak Firebase app'i export et
export default app; // app'i dışa aktar

// auth ve db'yi ayrıca dışa aktar
export { auth, db };

