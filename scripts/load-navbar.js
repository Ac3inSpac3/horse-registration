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
export async function loadNavbar(navbarId = 'navbar-placeholder', logoutRedirect = "index.html") {
    // Inject navbar HTML
    const res = await fetch('partials/navbar.html');
    document.getElementById(navbarId).innerHTML = await res.text();

    const auth = getAuth(app);
    const db = getFirestore(app);

    onAuthStateChanged(auth, async (user) => {
        const loggedInItems = document.querySelectorAll('.nav-logged-in');
        const loggedOutItems = document.querySelectorAll('.nav-logged-out');
        const adminItems = document.querySelectorAll('.nav-admin');

        if (user && user.emailVerified) {
            // Show basic logged-in elements
            loggedInItems.forEach(el => el.style.display = 'inline');
            loggedOutItems.forEach(el => el.style.display = 'none');

            // Check admin status
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
            // Logged out or unverified
            loggedInItems.forEach(el => el.style.display = 'none');
            loggedOutItems.forEach(el => el.style.display = 'inline');
            adminItems.forEach(el => el.style.display = 'none');
        }

        // Setup logout link
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', async () => {
                await signOut(auth);
                window.location.href = logoutRedirect;
            });
        }
    });
}
