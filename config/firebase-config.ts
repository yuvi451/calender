import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFSUrkz7Q_c5k_ZM2ANvNs0iv_Tl5tkpI",
  authDomain: "monthly-recurring-tasks.firebaseapp.com",
  projectId: "monthly-recurring-tasks",
  storageBucket: "monthly-recurring-tasks.firebasestorage.app",
  messagingSenderId: "307134504072",
  appId: "1:307134504072:web:99f708be743aedb97c933d",
  measurementId: "G-7TFJD5R5QF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const db = getFirestore(app)

const usersCollection = collection(db, "users")
const tasksCollection = collection(db, "tasks")

export {
  auth, 
  db, 
  googleProvider, 
  usersCollection,
  tasksCollection,
}
