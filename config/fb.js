// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constant from 'expo-constants';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
      apiKey: Constant.expoConfig.extra.apiKey,
      authDomain: Constant.expoConfig.extra.authDomain,
      projectId: Constant.expoConfig.extra.projectId,
      storageBucket: Constant.expoConfig.extra.storageBucket,
      messagingSenderId: Constant.expoConfig.extra.messagingSenderId,
      appId: Constant.expoConfig.extra.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
