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
let totalEvents = [];
let totalComments = [];

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

const docTitle = sessionStorage.getItem('title');





// Function to fetch all documents from a collection
async function getAllDocuments() {
    loader.classList.add('show-loader');
    console.log("entered");
    try {
        const querySnapshot = await db.collection("events").doc('adminEvents').get();
        console.log(querySnapshot.data().events);
        // const dataOutput = document.getElementById("data-output");
        totalEvents = querySnapshot.data().events;
        totalComments = querySnapshot.data().comments;
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
            if (title == docTitle) {
                // console.log(doc.data());
                document.getElementById('tickets').innerHTML = tickets;
                document.getElementById('description').innerHTML = desc;
                document.getElementById('userTitle').innerHTML = title;
                document.getElementById('date').innerHTML = date;
                document.getElementById('location').innerHTML = location;
                // document.getElementById('price').innerHTML = price;
                document.getElementById('time').innerHTML = time;
                // loader.classList.remove('show-loader');
                fetchComments();
            }
            // if()
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

function gotoAdminEditEventPage(){
    window.location.href = "./adminEditEvent.html";
}

function deleteEvent(){
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('deleteConfirmation').style.display = 'block';
}

async function deleteEventPermanently(){
    loader.classList.add('show-loader');
    document.getElementById('deleteConfirmation').style.display = 'none';
    console.log(totalEvents);
    // console.log(totalComments);
    const sessionTitle = sessionStorage.getItem('title');
    let i = 0;
    let j = 0;
    totalEvents.forEach((element)=>{
        if(element.title == sessionTitle){
            console.log(element);
            j = i;
            return
            // window.location.href = './adminEvents.html';
        }
        i++;
    })
    console.log(j);
    totalEvents.splice(j,1);
    // console.log(j);
    
    console.log(totalEvents);
    let insertObj = {
        events: totalEvents,
        comments: totalComments
      }
      console.log(insertObj);

    db.collection("events").doc('adminEvents').set(insertObj)
        .then(() => {
            // showMessage('success', 'Event added successfully!');
            console.log(('success'));
            window.location.href = './adminEvents.html'
            //   setTimeout(()=>{
                //   },2000)
            })
            .catch((error) => {
                loader.classList.remove('show-loader');
            console.log(error);
            // showMessage('error', `Error adding event: ${error.message}`);
        })
        .finally(() => {
            // Hide loader after operation completes
            loader.classList.remove('show-loader');
        });

    return false; // Prevent form submission

}

async function fetchComments(){
    const querySnapshot = await db.collection('comments').doc(sessionStorage.getItem('title')).get();
    console.log(querySnapshot.data());

    if(querySnapshot.data()){
        previousComments = querySnapshot.data()?.comments;

    const userComments = querySnapshot.data()?.comments;
    userComments?.forEach((element)=>{
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