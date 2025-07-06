// scripts/load-navbar.js
import { app } from "./firebase-init.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/**
 * Loads the navbar and applies visibility logic for login and admin status.
 * @param {string} navbarId - The DOM id to inject navbar into.
 * @param {string} logoutRedirect - URL to redirect after logout (default: index.html).
 */
// scripts/load-navbar.js
import { BASE_PATH } from "./env.js";

export async function loadNavbar(navbarId = "navbar-placeholder", logoutRedirect = "index.html") {
    const res = await fetch(`${BASE_PATH}/partials/navbar.html`);
    document.getElementById(navbarId).innerHTML = await res.text();

    const { app } = await import(`${BASE_PATH}/scripts/firebase-init.js`);
    const { getAuth, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js");
    const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");

    const auth = getAuth(app);
    const db = getFirestore(app);

    onAuthStateChanged(auth, async (user) => {
        const loggedInItems = document.querySelectorAll('.nav-logged-in');
        const loggedOutItems = document.querySelectorAll('.nav-logged-out');
        const adminItems = document.querySelectorAll('.nav-admin');

        if (user && user.emailVerified) {
            loggedInItems.forEach(el => el.style.display = 'inline');
            loggedOutItems.forEach(el => el.style.display = 'none');

            try {
                const accountRef = doc(db, "accounts", user.uid);
                const accountSnap = await getDoc(accountRef);
                const isAdmin = accountSnap.exists() && accountSnap.data().admin === true;
                adminItems.forEach(el => el.style.display = isAdmin ? 'inline' : 'none');
            } catch (err) {
                console.error("Error checking admin status:", err);
                adminItems.forEach(el => el.style.display = 'none');
            }
        } else {
            loggedInItems.forEach(el => el.style.display = 'none');
            loggedOutItems.forEach(el => el.style.display = 'inline');
            adminItems.forEach(el => el.style.display = 'none');
        }

        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', async () => {
                await signOut(auth);
                window.location.href = logoutRedirect;
            });
        }
    });
}
