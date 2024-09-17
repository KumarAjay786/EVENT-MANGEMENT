const firebaseConfig = {
  apiKey: "AIzaSyDS0HBW9dga14B0KlIwKewAEJ43109mSA8",
  authDomain: "event-6530c.firebaseapp.com",
  projectId: "event-6530c",
  storageBucket: "event-6530c.appspot.com",
  messagingSenderId: "280030244128",
  appId: "1:280030244128:web:5dbee6749d8b440b1cbb45"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

// Register Function
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();  // Prevent form from refreshing the page
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("status").innerHTML = "Registration successful!";
      window.location.href="./login.html"
      console.log("User registered:", userCredential.user);
    })
    .catch((error) => {
      document.getElementById("status").innerHTML = `Error: ${error.message}`;
      console.error("Error during registration:", error);
    });
});


document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        document.getElementById("loginStatus").innerHTML = "Login successful!";
      })
      .catch((error) => {
        document.getElementById("loginStatus").innerHTML = `Error: ${error.message}`;
      });
  });