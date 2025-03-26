import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAuDYtghmEfBBUXgci-CM7YMfaMHUoJTY4",
  authDomain: "medi-track-1d528.firebaseapp.com",
  projectId: "medi-track-1d528",
  storageBucket: "medi-track-1d528.firebasestorage.app",
  messagingSenderId: "827581199472",
  appId: "1:827581199472:web:0814a58b9dce1b3e4c30b5",
  measurementId: "G-NWQWL373LV"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
