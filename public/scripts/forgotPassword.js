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
  
  //Reset password
  function sendPasswordReset() {
    loader.classList.add('show-loader');
    console.log("aaaaaaaaaaaaa");
    
    const email = document.getElementById('loginEmail').value;
    console.log(email);
    
    if(email != ''){
        console.log("entered");
        
        auth.sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent!
        // alert("Password reset email sent! Check your inbox.");
        document.getElementById('loginEmail').value = '';
        loader.classList.remove('show-loader');
        document.getElementById("notification").style.display = 'block';
        document.getElementById("notification").style.backgroundColor = 'green';
        document.getElementById("notification").innerHTML = `${'Password reset email sent! Check your inbox.'}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error here
        console.error("Error sending password reset email:", errorCode, errorMessage);
        // alert("Error: " + errorMessage);
        loader.classList.remove('show-loader');
        document.getElementById("notification").style.display = 'block';
        document.getElementById("notification").innerHTML = `${errorMessage}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
      });
    }else{
        console.log("else");
        loader.classList.remove('show-loader');
        console.log(document.getElementById("notification"),"else");
        document.getElementById("notification").style.display = 'block';
        document.getElementById("notification").innerHTML = `${"Please enter the registered Email"}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
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

  
  function closeNotification(){
    document.getElementById('notification').style.display = 'none';
    document.getElementById("notification").innerHTML = ''
  }