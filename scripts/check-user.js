// scripts/check-user.js
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

/**
 * Ensures the user is logged in and email is verified.
 * If not, redirects to login.
 * @param {boolean} adminOnly - If true, also checks for admin status in Firestore
 * @returns {Promise<firebase.User>} - The logged in, verified user object
 */
export async function requireVerifiedUser(adminOnly = false) {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                alert("Please log in to access this page.");
                window.location.href = "../pages/login.html";
                return reject();
            }

            if (!user.emailVerified) {
                alert("Please verify your email before continuing.");
                await signOut(auth);
                window.location.href = "../pages/login.html";
                return reject();
            }

            if (adminOnly) {
                try {
                    const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");
                    const db = getFirestore();
                    const accountSnap = await getDoc(doc(db, "accounts", user.uid));
                    const isAdmin = accountSnap.exists() && accountSnap.data().admin;

                    if (!isAdmin) {
                        alert("You do not have permission to view this page.");
                        await signOut(auth);
                        window.location.href = "../pages/login.html";
                        return reject();
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    return reject(error);
                }
            }

            resolve(user);
        });
    });
}
