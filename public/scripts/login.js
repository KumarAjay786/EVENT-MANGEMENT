const firebaseConfig = {
  apiKey: "AIzaSyDS0HBW9dga14B0KlIwKewAEJ43109mSA8",
  authDomain: "event-6530c.firebaseapp.com",
  projectId: "event-6530c",
  storageBucket: "event-6530c.appspot.com",
  messagingSenderId: "280030244128",
  appId: "1:280030244128:web:5dbee6749d8b440b1cbb45"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const loader = document.getElementById('loader');
const db = firebase.firestore(app);

//Function to login with Email & Password
document.getElementById("loginForm").addEventListener("submit", (e) => {
  loader.classList.add('show-loader');
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.getIdToken().then((token) => {
        console.log(token);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', email);
        loader.classList.remove('show-loader');
        checkUserType();
      })
    })
    .catch((error) => {
      loader.classList.remove('show-loader');
      console.log(error,"ghjk");
      document.getElementById('notification').style.display = 'block';
      let message = '';
      if(error.code==='auth/internal-error'){
        message = JSON.parse(error.message).error.message
      }else{
        message = error.message.split('.')[0]
      }
      document.getElementById("notification").innerHTML = `${message}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
    });
});

// FUnction to login with Google
document.getElementById("googleLogin").addEventListener("click", () => {
  loader.classList.add('show-loader');
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      document.getElementById("loginStatus").innerHTML = `Google login successful! Welcome ${result.user.displayName}`;
      console.log(result);
      const user = result.user;
      user.getIdToken().then((token) => {
        console.log(token);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', user.email);
        loader.classList.remove('show-loader');
        window.location.href = './eventDiscovery.html'
      })
    })
    .catch((error) => {
      loader.classList.remove('show-loader');
      document.getElementById("loginStatus").innerHTML = `Error: ${error.message}`;
    });
});

// FUnction to check the user role (admin or attandee)
async function checkUserType() {
  loader.classList.add('show-loader');
  console.log("entered");
  try {
    const email = sessionStorage.getItem('email');
    const querySnapshot = await db.collection("userType").doc(email).get();
    console.log(querySnapshot.data());
    const uDetails = querySnapshot.data();
    const uType = uDetails.userType;
    console.log(email);
    console.log(uType);
    if (uType == 'admin') {
      window.location.href = './adminEvents.html';
    } else {
      window.location.href = './eventDiscovery.html'
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// To check the Email field validation
function checkEmail(){
  if(document.getElementById('loginEmail').value == ''){
    document.getElementById('emailError').innerText = 'Email Field should not be blank'
    document.getElementById('emailError').style.visibility = 'visible';
    document.getElementById('loginEmail').style.borderColor = 'red';
  }
  else{
    document.getElementById('emailError').style.visibility = 'hidden';
    document.getElementById('loginEmail').style.borderColor = 'grey';
  }
}

// To check the Password field validation
function checkPassword(){
  if(document.getElementById('loginPassword').value == ''){
    document.getElementById('passwordError').innerText = 'Password Field should not be blank'
    document.getElementById('passwordError').style.visibility = 'visible';
    document.getElementById('loginPassword').style.borderColor = 'red';
  }
  else{
    document.getElementById('passwordError').style.visibility = 'hidden';
    document.getElementById('loginPassword').style.borderColor = 'grey';
  }
}

function closeNotification(){
  document.getElementById('notification').style.display = 'none';
  document.getElementById("notification").innerHTML = ''
}