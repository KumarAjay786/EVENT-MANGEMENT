const firebaseConfig = {
    apiKey: "AIzaSyDS0HBW9dga14B0KlIwKewAEJ43109mSA8",
    authDomain: "event-6530c.firebaseapp.com",
    projectId: "event-6530c",
    storageBucket: "event-6530c.appspot.com",
    messagingSenderId: "280030244128",
    appId: "1:280030244128:web:5dbee6749d8b440b1cbb45"
  };

// Initialize Firebase
app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(app);

const token = sessionStorage.getItem('token');
const loader = document.getElementById('loader');
if (!token) {
    alert('unauthorize')
    window.location.href = './login.html'
}

// Logout Function
document.getElementById("logoutButton").addEventListener("click", () => {
    loader.classList.add('show-loader');
    auth.signOut()
        .then(() => {
            // Sign-out successful
            console.log("User signed out");
            sessionStorage.clear();
            loader.classList.remove('show-loader'); // Hide loader on error
            // Optionally redirect to the login page after logout
            window.location.href = "./login.html";  // Replace with your login page
        })
        .catch((error) => {
            // An error happened during logout
            console.error("Error during logout:", error);
        });
});

const email = sessionStorage.getItem('email');
document.getElementById('uName').innerHTML = `${email.split('@')[0]}`;
// window.onload(()=>{
//     console.log(document.getElementById('uName').ariaValueMax,"hsvbfefb");
// })
// const isBooked = sessionStorage.getItem('isBook');
// const persons = sessionStorage.getItem('person');
// console.log(isBooked);
// if (isBooked == 'true') {
//     const bookelement = document.getElementById('isBooked');
//     bookelement.style.display = 'block';
//     bookelement.innerHTML = `Booked for ${persons} Persons`;
// }

const getDoc = sessionStorage.getItem('title');





// Function to fetch all documents from a collection
async function getAllDocuments() {
    loader.classList.add('show-loader');
    console.log("entered");
    try {
        const querySnapshot = await db.collection("events").doc('adminEvents').get();
        console.log(querySnapshot);
        // const dataOutput = document.getElementById("data-output");

        // Loop through each document in the collection
        querySnapshot.data().events.forEach((doc) => {
            // doc.data() is the document's data
            // dataOutput.innerHTML += `<p>Document ID: ${doc.id}, Data: ${JSON.stringify(doc.data())}</p>`;
            const title = doc.title;
            const desc = doc.description;
            const time = doc.time;
            const price = doc.price;
            const location = doc.location;
            const date = doc.date;
            const tickets = doc.tickets;
            if (title == getDoc) {
                document.getElementById('tickets').innerHTML = tickets;
                document.getElementById('description').innerHTML = desc;
                document.getElementById('userTitle').innerHTML = title;
                document.getElementById('date').innerHTML = date;
                document.getElementById('location').innerHTML = location;
                // document.getElementById('price').innerHTML = price;
                document.getElementById('time').innerHTML = time;
                document.getElementById('price').innerHTML = price;
                // loader.classList.remove('show-loader');
                fetchBookedPersons();
                fetchComments();
            }
            // if()
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

let bookingDetails = [];
async function fetchBookedPersons() {
    const email = sessionStorage.getItem('email');
    let persons = 0;
    const querySnapshot = await db.collection("bookings").doc(email).get();
    console.log(querySnapshot.data()?.bookings);
    bookingDetails = querySnapshot.data()?.bookings
    querySnapshot.data()?.bookings.forEach((element) => {
        //   console.log(element.numberOfBookings);

        if (element.title == sessionStorage.getItem('title')) {
            console.log(sessionStorage.getItem('title'));
            console.log(element.title);
            console.log(element.numberOfBookings);
            persons = (persons + Number(element.numberOfBookings));
        }

    })
    console.log('total persons booked ', persons);
    if (persons != 0) {
        document.getElementById('isBooked').style.display = 'block';
        document.getElementById('bookingDetails').style.display = 'block';
        document.getElementById('isBooked').innerText = `Booked for ${persons} Person(s)`;
    }
    loader.classList.remove('show-loader');
}

function gotoBookEventPage() {
    window.location.href = './book.html'
}

function gotoBookingDetailsPage() {
    // console.log(bookingDetails);
    document.getElementById('bookingDetails').style.display = 'flex';
    document.getElementById('bookingDetails').style.color = '#0A7273';
    document.getElementById('bookingDetails').style.alignItems = 'center';
    document.getElementById('bookingDetails').style.fontSize = 'bold';
    document.getElementById('bookingDetails').innerHTML = `<span>Scroll Below to view Booking Details</span>`
    const bookingArray = [];
    bookingDetails.forEach((element) => {
        if (element.title == sessionStorage.getItem('title')) {
            bookingArray.push(element);
        }
    })
    console.log(bookingArray);
    bookingArray.forEach((element) => {
        const booking = `<div style="color: black;
    background-color: #ffffff99;
    padding: 1rem;
    border-radius: 5px;margin-bottom: 1rem">
                            <p>Booking ID : ${element.bookingId}</p>
                            <p>Bookings : ${element.numberOfBookings}</p>
                            <p>Booking Date : ${element.bookingDate}</p>
                        </div>`
        const divElement = document.getElementById('bookingDetailsDiv');
        divElement.innerHTML += booking;
    })

}

let previousComments = [];
async function submitComment() {
    loader.classList.add('show-loader');
    // let previousComments = [];
    console.log(previousComments);
    if (document.getElementById('comment').value != '') {
        const userComment = document.getElementById('comment').value;
        console.log(userComment);
        let arr = [];
        const obj = {
            comment: document.getElementById('comment').value,
            email: sessionStorage.getItem('email'),
            date: new Date().toString()
        }
        // arr.push(obj);
        if(previousComments){
            previousComments.push(obj);
        console.log(previousComments);
        const insertObj = {
            comments: previousComments
        }
        console.log(insertObj);
        commentsStoredInFirebase(insertObj);
        }else{
            arr.push(obj);
            console.log("else parts");
            const insertObj = {
                comments: arr
            }
            console.log(insertObj);
            commentsStoredInFirebase(insertObj);
        }
        
    }
}

async function commentsStoredInFirebase(insertObject){
    await db.collection('comments').doc(sessionStorage.getItem('title')).set(insertObject)
        .then(() => {
            loader.classList.remove('show-loader');
            window.location.reload();
          })
          .catch((error) => {
            // showMessage('error', `Error adding event: ${error.message}`);
          })
          .finally(() => {
            // Hide loader after operation completes
            loader.classList.remove('show-loader');
          });
        
          document.getElementById('comment').value = '';
          return false; // Prevent form submission
}

async function fetchComments(){
    const querySnapshot = await db.collection('comments').doc(sessionStorage.getItem('title')).get();
    console.log(querySnapshot.data());

    if(querySnapshot.data()){
        previousComments = querySnapshot.data()?.comments;

    const userComments = querySnapshot.data()?.comments;
    userComments?.forEach((element)=>{
        // console.log(element.email.slice(0,1));
        
        const firstEmailLetter = element.email.slice(0,1);
        const emailName = element.email.split('@')[0];
        document.getElementById('commentDetailsDiv').innerHTML += `<div style="margin-bottom:1rem;box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;padding:1rem">
                                                                    <div style="display:flex;align-items:center">
                                                                    <div style="padding: 5px 10px;background-color: green;border-radius: 50%;margin-right:5px;color:white">${firstEmailLetter.toUpperCase()}</div>
                                                                    <div style="color:black">${emailName}</div>
                                                                    </div>
                                                                    <div style="font-size:small;color:#0A7273;margin-top:5px">${element.comment}</div>
                                                                    <div style="font-size:x-small;color:#a9a6a6">${element.date}</div>
                                                                  </div>`
    })
    loader.classList.remove('show-loader');
    }else{
        document.getElementById('commentDetailsDiv').innerHTML = `<div style="margin-bottom:1rem">No comments yet</div>`;
        loader.classList.remove('show-loader');
    }
}

// async function getUserType() {
//     loader.classList.add('show-loader');
//     console.log("entered");
//     try {
//         const querySnapshot = await db.collection("userType").doc('lsxVFVrbuzKrrcibO0Q1').get();
//         console.log(querySnapshot.data());
//         const uDetails = querySnapshot.data();
//         const uType = uDetails.userType;
//         if (uType == 'admin') {
//             document.getElementById('editBtn').style.display = `block`;
//             document.getElementById('bookBtn').style.display = `none`;
//             loader.classList.remove('show-loader');
//         } else {
//             document.getElementById('editBtn').style.display = `none`;
//             document.getElementById('bookBtn').style.display = `block`;
//             loader.classList.remove('show-loader');
//         }
//     } catch (error) {
//         console.error("Error getting documents: ", error);
//     }
// }

window.onload = getAllDocuments();

// Call the function to fetch all documents