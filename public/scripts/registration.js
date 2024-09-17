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
const db = firebase.firestore(app);
const auth = firebase.auth();
let pError = '';
let cError = '';

// Register Function
document.getElementById("registerForm").addEventListener("submit", (e) => {
  loader.classList.add('show-loader');
  e.preventDefault();  // Prevent form from refreshing the page
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // const uType = document.getElementById("admin").value;
  // const mobile = document.getElementById("mobile").value;

  if(document.getElementById('signUpName') !='' && document.getElementById('email') != '' && document.getElementById('mobile') != ''
  && document.getElementById('password') !='' && document.getElementById('cpassword') != ''){
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        document.getElementById("status").innerHTML = "Registration successful!";
        saveUserData();
      })
      .catch((error) => {
        loader.classList.remove('show-loader');
        document.getElementById("status").innerHTML = `Error: ${error.message}`;
        console.error("Error during registration:", error);
        console.log(error);
        if(error.code == 'auth/email-already-in-use'){
          document.getElementById('notification').style.display = 'block';
      document.getElementById("notification").innerHTML = `${error.message}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
        }
        
      });
  }else{
    document.getElementById('notification').style.display = 'block';
      document.getElementById("notification").innerHTML = `${'Please fill all the fields'}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
  }
});

function saveUserData() {
  console.log(document.getElementsByName('userType'));
  document.getElementsByName('userType').forEach((i) => {
    if (i.checked) {
      console.log(i.value);
      const uType = i.value;
      const email = document.getElementById("email").value;
      db.collection("userType").doc(email).set({
        userType: uType,
        email: email
      })
        .then(() => {
          window.location.href = "./login.html"
          console.log("User registered:", userCredential.user);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // Hide loader after operation completes
          loader.classList.remove('show-loader');
        });
    }
  })
}

// let mobileNumberValue1 = '';
// let len = 0;
// function validateMobileNumber(){
//   console.log("enered");
//   mobileNumberValue = document.getElementById('mobileDiv').value;
//   if (mobileNumberValue.length == 1) {
//     console.log("entered in first if");
//     if (/[6-9]/.test(mobileNumberValue)) {
//       console.log("entered in first inner if");
//       console.log(mobileNumberValue);
//       mobileNumberValue1 = document.getElementById('mobileDiv').value;
//       len = mobileNumberValue1.length;
//     } else {
//       console.log("entered first in inner else");
//       document.getElementById('mobileDiv').value = '';
//     }
//   } else if (mobileNumberValue.length <= 10) {
//     console.log("entered in else block");
//     console.log(mobileNumberValue);
//     console.log(mobileNumberValue.slice(-1));
//     console.log(/0-9/.test(1));
//     if (/[0-9]/.test(mobileNumberValue.slice(-1))) {
//       console.log("entered in else block if ");
//       console.log(mobileNumberValue);
//       mobileNumberValue1 = document.getElementById('mobileDiv').value;
//     } else {
//       console.log("entered in else block else ");
//       console.log(mobileNumberValue1, "last else");
//       // mobileNumberValue = mobileNumberValue1;
//       document.getElementById('mobileDiv').value = mobileNumberValue1;
//       console.log(mobileNumberValue);
//       if(mobileNumberValue  == ''){
//         document.getElementById('mobileDiv').value = '';
//       }

//     }
//   }else{
//     console.log("ending else");
//     document.getElementById('mobileDiv').value = mobileNumberValue1;
//   }
// }

let tempMobile = ''; // To store the last valid number

function validatemobile() {
    let mobileInput = document.getElementById("mobile");
    let mobilenumber = mobileInput.value;

    // Remove any non-numeric characters (only allow digits)
    mobilenumber = mobilenumber.replace(/\D/g, '');
    mobileInput.value = mobilenumber; // Set the input back to cleaned-up digits

    // Now call the validation function
    validateMobileNumber(mobilenumber, mobileInput);
}

function validateMobileNumber(mobilenumber, mobileInput) {
    // Ensure the first digit is between 6 and 9
    if (mobilenumber.length > 0 && !/^[6-9]/.test(mobilenumber)) {
        // Invalid starting digit, revert to last valid input
        mobileInput.value = tempMobile;
        console.log("Invalid starting digit, reverting to last valid input");
        return false;
    }

    // Prevent more than 10 digits
    if (mobilenumber.length > 10) {
        mobilenumber = mobilenumber.slice(0, 10); // Limit to 10 digits
        mobileInput.value = mobilenumber;
    }

    // If it's a valid 10-digit number, store it as the last valid number
    if (mobilenumber.length === 10) {
        tempMobile = mobilenumber;
        console.log("Valid number:", mobilenumber);
        return true;
    } else {
        console.log("Waiting for 10 digits...");
        return false;
    }
}

// Event listener for real-time validation
document.getElementById("mobile").addEventListener("input", validatemobile);

function checkName(){
  if(document.getElementById('signUpName').value == ''){
    document.getElementById('nameError').innerText = 'Name Field should not be blank'
    document.getElementById('nameError').style.visibility = 'visible';
    document.getElementById('signUpName').style.borderColor = 'red';
  }
  else{
    document.getElementById('nameError').style.visibility = 'hidden';
    document.getElementById('signUpName').style.borderColor = 'grey';
  }
}

function checkEmail(){
  if(document.getElementById('email').value == ''){
    document.getElementById('emailError').innerText = 'Email Field should not be blank'
    document.getElementById('emailError').style.visibility = 'visible';
    document.getElementById('email').style.borderColor = 'red';
  }
  else{
    document.getElementById('emailError').style.visibility = 'hidden';
    document.getElementById('email').style.borderColor = 'grey';
  }
}

function checkMobileError(){
  if(document.getElementById('mobile').value == ''){
    document.getElementById('mobileError').innerText = 'Email Field should not be blank'
    document.getElementById('mobileError').style.visibility = 'visible';
    document.getElementById('mobile').style.borderColor = 'red';
  }
  else{
    document.getElementById('mobileError').style.visibility = 'hidden';
    document.getElementById('mobile').style.borderColor = 'grey';
  }
}

function checkPassword(){
  if(document.getElementById('password').value == ''){
    document.getElementById('passwordError').innerText = 'Email Field should not be blank'
    document.getElementById('passwordError').style.visibility = 'visible';
    document.getElementById('password').style.borderColor = 'red';
  }
  else{
    document.getElementById('passwordError').style.visibility = 'hidden';
    document.getElementById('password').style.borderColor = 'grey';
  }
}

function closeNotification(){
  document.getElementById('notification').style.display = 'none';
  document.getElementById("notification").innerHTML = ''
}







// Function to validate the password based on given rules
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const noWhitespace = /^\S*$/;

  // Password validation logic
  if (password.length < minLength) {

      return "Password must be at least 8 characters long.";
  }
  if (!hasUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter.";
  }
  if (!hasLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter.";
  }
  if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
  }
  if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character.";
  }
  if (!noWhitespace.test(password)) {
      return "Password must not contain any whitespace.";
  }

  return ""; // No errors
}

// Function to validate the confirm password field
function validateConfirmPassword(password, confirmPassword) {
  if (confirmPassword !== password) {
      return "Passwords do not match.";
  }
  return ""; // No errors
}

// Real-time password validation
document.getElementById("password").addEventListener("input", function() {
  const passwordInput = this.value;
  const passwordError = document.getElementById("passwordError");

  const errorMessage = validatePassword(passwordInput);
  if (errorMessage) {
      passwordError.textContent = errorMessage;
      passwordError.classList.add("error");
  } else {
      passwordError.textContent = "Password is valid.";
      passwordError.classList.remove("error");
      passwordError.classList.add("valid");
  }
});

// Real-time confirm password validation
document.getElementById("cpassword").addEventListener("input", function() {
  const passwordInput = document.getElementById("password").value;
  const confirmPasswordInput = this.value;
  const confirmPasswordError = document.getElementById("cpasswordError");

  const errorMessage = validateConfirmPassword(passwordInput, confirmPasswordInput);
  if (errorMessage) {
      confirmPasswordError.textContent = errorMessage;
      confirmPasswordError.classList.add("error");
  } else {
      confirmPasswordError.textContent = "Passwords match.";
      confirmPasswordError.classList.remove("error");
      confirmPasswordError.classList.add("valid");
  }
});
// Final check before form submission
document.getElementById("submitBtn").addEventListener("click", function(event) {
  const passwordInput = document.getElementById("password").value;
  const confirmPasswordInput = document.getElementById("cpassword").value;
  const passwordError = document.getElementById("passwordError").textContent;
  pError = passwordError;
  const confirmPasswordError = document.getElementById("cpasswordError").textContent;
  cError = confirmPasswordError;
  // Prevent form submission if there are errors
  // if (document.getElementById('signUpName') !='' && document.getElementById('loginEmail') != '' && document.getElementById('mobile') != ''
  // && document.getElementById('password') !='' && document.getElementById('cpassword') != '') {
    if(passwordError !== "Password is valid." || confirmPasswordError !== "Passwords match."){
      event.preventDefault();
      // alert("Please fix the errors before submitting.");
      document.getElementById('notification').style.display = 'block';
      document.getElementById("notification").innerHTML = `${'Password does not matcheswith Confirm Password'}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
      setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
      }, 3000);
    }
  // }else{
  //   document.getElementById('notification').style.display = 'block';
  //     document.getElementById("notification").innerHTML = `${'Please fill all the fields'}<span style="color: rgb(83, 81, 81);margin-left: 8px;cursor: pointer;" onclick="closeNotification()">X</span>`;
  //     setTimeout(() => {
  //       document.getElementById('notification').style.display = 'none';
  //     }, 3000);
  // }
});