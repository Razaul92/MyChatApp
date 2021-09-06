import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA-WFlN1wzuSM0aZoGvSh8n7k2X01h7HtU",
  authDomain: "mychatapp-bbdb2.firebaseapp.com",
  projectId: "mychatapp-bbdb2",
  storageBucket: "mychatapp-bbdb2.appspot.com",
  messagingSenderId: "487337545794",
  appId: "1:487337545794:web:92951503da44a903685ddb",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
