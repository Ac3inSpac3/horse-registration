// Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        alert("Logged in!");
    } catch (err) {
        alert("Login failed: " + err.message);
    }
});

// Logout
document.getElementById('logout')?.addEventListener('click', () => {
    firebase.auth().signOut();
});

// Listen for login state changes
firebase.auth().onAuthStateChanged((user) => {
    const adminLinks = document.getElementById('admin-links');
    const loginForm = document.getElementById('login-form');
    if (user) {
        if (adminLinks) adminLinks.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
    } else {
        if (adminLinks) adminLinks.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    }
});
