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
const email = sessionStorage.getItem('email');
let totalEvents = [];
let totalComments = [];

// Add event to Firestore
function addEvent() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const tickets = document.getElementById('tickets').value;

    const loader = document.getElementById('loader');
    const form = document.getElementById('eventForm');

    // Show loader with backdrop when starting the process
    loader.classList.add('show-loader');

    if (!title || !description || !date || !time || !location || !price) {
        showMessage('error', 'All fields are required!');
        loader.classList.remove('show-loader'); // Hide loader on error
        return false;
    }

    totalEvents.forEach((element)=>{
        const sessionTitle = sessionStorage.getItem('title');
        if(element.title == sessionTitle){
            console.log(element);
            // const obj = {
                element.title = document.getElementById('title').value,
                element.description = document.getElementById('description').value,
                element.date = document.getElementById('date').value,
                element.time = document.getElementById('time').value,
                element.location = document.getElementById('location').value,
                element.price = document.getElementById('price').value
                element.tickets = document.getElementById('tickets').value
            // }
        }
    })
    console.log(totalEvents);
    let insertObj = {
        events: totalEvents,
        comments: totalComments
      }
      console.log(insertObj);

    db.collection("events").doc('adminEvents').set(insertObj)
        .then(() => {
            showMessage('success', 'Event added successfully!');
            form.reset();
            window.location.href = './adminEvents.html'
            //   setTimeout(()=>{
            //   },2000)
        })
        .catch((error) => {
            showMessage('error', `Error adding event: ${error.message}`);
        })
        .finally(() => {
            // Hide loader after operation completes
            loader.classList.remove('show-loader');
        });

    return false; // Prevent form submission
}

// Show animated message
function showMessage(type, message) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = message;
    messageBox.className = `message ${type} show`;

    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}


async function getEventDetails() {
    loader.classList.add('show-loader');
    console.log("entered");
    try {
        const querySnapshot = await db.collection("events").doc('adminEvents').get();
        console.log(querySnapshot.data());
        const events = querySnapshot.data().events;
        console.log(events);
        totalEvents = querySnapshot.data().events;
        totalComments = querySnapshot.data().comments;
        const docTitle = sessionStorage.getItem('title');
        console.log(docTitle);
        events.forEach(element => {     
            if (element.title == docTitle) {
                document.getElementById('title').value = element.title;
                document.getElementById('description').value = element.description;
                document.getElementById('date').value = element.date;
                document.getElementById('time').value = element.time;
                document.getElementById('location').value = element.location;
                document.getElementById('price').value = element.price;
                document.getElementById('tickets').value = element.tickets;
                loader.classList.remove('show-loader');
            }
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        loader.classList.remove('show-loader');
    }
}

window.onload = getEventDetails();
