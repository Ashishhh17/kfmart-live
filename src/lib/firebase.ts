import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  projectId: "infinite-jetty-kr7h4",
  appId: "1:377006469634:web:e92b7d922c65961911ed1b",
  apiKey: "AIzaSyAQgHKkDRt6CyZDwyFgFkzKBTlZOkg3oLo",
  authDomain: "infinite-jetty-kr7h4.firebaseapp.com",
  storageBucket: "infinite-jetty-kr7h4.firebasestorage.app",
  messagingSenderId: "377006469634"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-remixremixkfmart-fc386353-4a1f-44a7-9d50-a7748c3790a9");
