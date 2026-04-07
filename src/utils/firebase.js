// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // دي المكتبة الخاصة بالشات والـ Real-time

// الكود اللي نسخته من فايربيس
const firebaseConfig = {
    apiKey: "AIzaSyCnMV4jjOmCDQWPVyReg_rqFyOzBbl3qT8",
    authDomain: "doctor-mate-c7ca5.firebaseapp.com",
    projectId: "doctor-mate-c7ca5",
    storageBucket: "doctor-mate-c7ca5.firebasestorage.app",
    messagingSenderId: "395649526681",
    appId: "1:395649526681:web:6525704ac3028e77e64108",
    measurementId: "G-DB0ZJVV2EC"
};

// 1. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 2. تشغيل خدمة قاعدة البيانات (Firestore)
export const db = getFirestore(app);