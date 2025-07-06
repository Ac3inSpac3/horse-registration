// scripts/db-helpers.js

// Lazy-load Firestore only when needed
const loadFirestore = async () => {
    const firebase = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");
    return {
        getFirestore: firebase.getFirestore,
        collection: firebase.collection,
        doc: firebase.doc,
        getDoc: firebase.getDoc,
        setDoc: firebase.setDoc,
        addDoc: firebase.addDoc,
        query: firebase.query,
        where: firebase.where,
        getDocs: firebase.getDocs,
        serverTimestamp: firebase.serverTimestamp
    };
};

export async function saveAccount(user) {
    const {
        getFirestore,
        doc,
        setDoc,
        serverTimestamp
    } = await loadFirestore();

    const db = getFirestore();
    return await setDoc(doc(db, "accounts", user.uid), {
        uid: user.uid,
        email: user.email,
        admin: false,
        createdAt: serverTimestamp()
    });
}


// Save a new member registration
export async function saveMember(data) {
    const {
        getFirestore,
        collection,
        addDoc,
        serverTimestamp
    } = await loadFirestore();

    const db = getFirestore();
    return await addDoc(collection(db, "members"), {
        ...data,
        isCurrent: false,
        createdAt: serverTimestamp(),
        memberSince: new Date().getFullYear()
    });
}

// Save a new horse registration
export async function saveHorse(data) {
    const {
        getFirestore,
        collection,
        addDoc,
        serverTimestamp
    } = await loadFirestore();

    const db = getFirestore();
    return await addDoc(collection(db, "horses"), {
        ...data,
        isCurrent: false,
        createdAt: serverTimestamp()
    });
}

// Get account info from Firestore
export async function getAccount(uid) {
    const {
        getFirestore,
        doc,
        getDoc
    } = await loadFirestore();

    const db = getFirestore();
    const snap = await getDoc(doc(db, "accounts", uid));
    return snap.exists() ? snap.data() : null;
}

// Placeholder: Get all memberships for a user by UID or email/phone
export async function getMemberRegistrations({ uid = null, email = null, phone = null }) {
    const {
        getFirestore,
        collection,
        query,
        where,
        getDocs
    } = await loadFirestore();

    const db = getFirestore();
    const conditions = [];

    if (uid) conditions.push(where("uid", "==", uid));
    if (email) conditions.push(where("email", "==", email));
    if (phone) conditions.push(where("phone", "==", phone));

    const q = query(collection(db, "members"), ...conditions);
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Placeholder: Get horses registered under a member UID or membership ID
export async function getHorseRegistrations({ memberId = null, uid = null }) {
    const {
        getFirestore,
        collection,
        query,
        where,
        getDocs
    } = await loadFirestore();

    const db = getFirestore();
    const conditions = [];

    if (memberId) conditions.push(where("memberId", "==", memberId));
    if (uid) conditions.push(where("uid", "==", uid));

    const q = query(collection(db, "horses"), ...conditions);
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
