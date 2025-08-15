// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtiBdHwYCV7vkHiuGZvHij7UxphP4g54E",
  authDomain: "questionpro-99817.firebaseapp.com",
  projectId: "questionpro-99817",
  storageBucket: "questionpro-99817.appspot.com",
  messagingSenderId: "70423030493",
  appId: "1:70423030493:web:ae543436fc71bdab180934",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Show section
window.showSection = function (sectionId) {
  document.querySelectorAll(".section").forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(sectionId)?.classList.remove("hidden");
};

// Toggle mobile menu
window.toggleMobileMenu = function () {
  document.getElementById("mobile-menu").classList.toggle("hidden");
};

// Toggle user dropdown
window.toggleUserDropdown = function () {
  const dropdown = document.getElementById("user-dropdown");
  const arrow = document.getElementById("arrow-icon");

  dropdown.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");
};

// Signup
window.submitSignup = function (event) {
  event.preventDefault();
  const form = event.target;
  const fullname = form.fullname.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const username = form.username.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return db.collection("users").doc(user.uid).set({
        fullname,
        email,
        username,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => {
      window.location.href = "../index.html"; 
    })
    .catch((error) => alert(error.message));
};

// Login
window.submitLogin = function (event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => alert(error.message));
};

// Logout
window.logoutUser = function () {
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
};

// Auth UI Handling
auth.onAuthStateChanged((user) => {
  const signInBtn = document.getElementById("sign-in-btn");
  const mobileSignInBtn = document.getElementById("mobile-signin-btn");
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  const userInfo = document.getElementById("user-info");
  const dropdown = document.getElementById("user-dropdown");
  const mobileUserRow = document.getElementById("mobile-user-row");
  const mobileUserName = document.getElementById("mobile-user-name");
  const userName = document.getElementById("user-name");

  if (user) {
    db.collection("users").doc(user.uid).get().then((doc) => {
      const name = doc.exists ? (doc.data().username || user.email) : user.email;
      userName.innerText = `Hello ${name} !`;
      mobileUserName.innerText = `Hello ${name}!`;
    });

    // Show user info and logout
    userInfo.style.display = "inline-block";
    if (signInBtn) signInBtn.style.display = "none";
    if (mobileSignInBtn) mobileSignInBtn.style.display = "none";
    if (mobileLogoutBtn) mobileLogoutBtn.classList.remove("hidden");
    if (mobileUserRow) mobileUserRow.style.display = "flex";

  } else {
    // Show Sign In
    userInfo.style.display = "none";
    if (signInBtn) signInBtn.style.display = "inline-block";
    if (mobileSignInBtn) mobileSignInBtn.style.display = "block";
    if (mobileLogoutBtn) mobileLogoutBtn.classList.add("hidden");
    if (mobileUserRow) mobileUserRow.style.display = "none";
    if (dropdown) dropdown.classList.add("hidden");
  }
});

window.openTopic = function (topicName) {
  showModal(`
    <div class="text-center">
      <div class="text-5xl mb-4">📘</div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">${topicName}</h3>
      <p class="text-gray-600 mb-4">Coming soon: Tutorials, quizzes and practice for <strong>${topicName}</strong>.</p>
      <button class="btn-primary text-white px-6 py-2 rounded" onclick="closeModal()">Close</button>
    </div>
  `);
};

document.addEventListener("DOMContentLoaded", () => {
  const adminEmail = "jatinseta7@gmail.com";
  const adminLink = document.getElementById("admin-link"); // Desktop
  const adminLinkMobile = document.getElementById("mobile-admin-link"); // Mobile

  auth.onAuthStateChanged((user) => {
    const isAdmin =
      user && user.email.toLowerCase() === adminEmail.toLowerCase();

    if (adminLink) {
      if (isAdmin) {
        adminLink.classList.remove("hidden");
      } else {
        adminLink.classList.add("hidden");
      }
    }

    if (adminLinkMobile) {
      if (isAdmin) {
        adminLinkMobile.classList.remove("hidden");
      } else {
        adminLinkMobile.classList.add("hidden");
      }
    }

    console.log(
      isAdmin
        ? `✅ Admin access granted to: ${user.email}`
        : "🚫 Admin access denied"
    );
  });
});
