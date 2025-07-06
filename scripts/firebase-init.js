// scripts/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

const firebaseConfig = {
            apiKey: "AIzaSyDpSfm7AvWXTyuVD3guikLG8-uFRd33qSU",
            authDomain: "pinto-registration.firebaseapp.com",
            projectId: "pinto-registration",
            storageBucket: "pinto-registration.firebasestorage.app",
            messagingSenderId: "519987084013",
            appId: "1:519987084013:web:2e5c42738798a4f22d2ae4",
            measurementId: "G-E15Z5YL5P5"
        };

export const app = initializeApp(firebaseConfig);
