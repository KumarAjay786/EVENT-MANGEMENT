
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
const email = sessionStorage.getItem('email');
const token = sessionStorage.getItem('token');
let fetchedAllEvents = [];
let tempFetchedAllEvents = [];
let showFilteredEvents = [];
let noSearchFoundActiveness = 'false';
if(!token){
  alert('unauthorize')
  window.location.href = './login.html'
}

const loader = document.getElementById('loader');
document.getElementById('uName').innerHTML = `${email.split('@')[0]}`

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

async function searchEvent(){
  noSearchFoundActiveness = 'true';
  loader.classList.add('show-loader');
  const eventsContainer = document.getElementById('eventsContainer');
  eventsContainer.innerHTML = '';
  document.getElementById('noSearchFound').style.display = 'none';
  fetchedAllEvents = tempFetchedAllEvents;
  // console.log(document.getElementById('dropdown').value);
  // console.log(document.getElementById('searchInput').value);
  showFilteredEvents = await fetchedAllEvents.filter(temp);
  // console.log(await fetchedAllEvents.filter(temp));
  await displayAllEvents(showFilteredEvents);
}
function temp(element){
  console.log("entered in filter block");
  // console.log(document.getElementById('dropdown').value);
  // console.log(document.getElementById('searchInput').value);
  // console.log(element.location);
  if(document.getElementById('dropdown').value == 'title' && element.title.toLowerCase().includes(document.getElementById('searchInput').value)){
    console.log(element.title.toLowerCase().includes(document.getElementById('searchInput').value));
    console.log(element.title);
    return element;
  }
  else if(document.getElementById('dropdown').value == 'location' && element.location.toLowerCase().includes(document.getElementById('searchInput').value)){
    console.log(element.location);
    console.log(document.getElementById('searchInput').value);
    console.log(element.location.toLowerCase().includes(document.getElementById('searchInput').value));
    return element;
  }
  else if(document.getElementById('dropdown').value == 'date' && element.date.toLowerCase().includes(document.getElementById('searchInput').value)){
    console.log(element.date);
    console.log(document.getElementById('searchInput').value);
    console.log(element.date.toLowerCase().includes(document.getElementById('searchInput').value));
    return element;
  }
  else if(document.getElementById('dropdown').value == 'time' && element.time.toLowerCase().includes(document.getElementById('searchInput').value)){
    console.log(element.time);
    console.log(document.getElementById('searchInput').value);
    console.log(element.time.toLowerCase().includes(document.getElementById('searchInput').value));
    return element;
  }
  else{
    return;
  }
  // document.getElementById('dropdown').value = 'location';
  // document.getElementById('searchInput').value = '';
}

// Fetch all events from Firestore
async function fetchEvents() {
  loader.classList.add('show-loader');
  const querySnapshot = await db.collection("events").doc('adminEvents').get();
    // .then((querySnapshot) => {
      console.log(querySnapshot.data());
      fetchedAllEvents = querySnapshot.data().events;
      tempFetchedAllEvents = querySnapshot.data().events;
      displayAllEvents(fetchedAllEvents);
    // })
    // .catch((error) => {
    //   console.error("Error fetching events: ", error);
    // }).finally(()=>{
    //   loader.classList.remove('show-loader'); // Hide loader on error
    // });
}

function displayAllEvents(fetchedAllEvents){
  console.log("entered in display block");
  console.log(fetchedAllEvents);
  console.log(fetchedAllEvents.length);
  if(fetchedAllEvents.length == 0 && noSearchFoundActiveness == 'true'){
    document.getElementById('noSearchFound').style.display = 'block';
    noSearchFound.innerHTML = `<div>No Events Matches with the Search</div>`;
  }
  fetchedAllEvents.forEach((doc) => {
    const eventData = doc;
    const arr = [];
    arr.push(eventData.title);
    arr.push(eventData.date);
    arr.push(eventData.time);
    arr.push(eventData.location);
    arr.push(eventData.description);
    // Create card for each event
    const eventCard = `
      <div class="card" id="${eventData.title}" onclick="redir(this)">
        <div class="card-header"><div style="display: flex;
justify-content: center;
background-color: green;
border-radius: 6px;
margin-bottom: 1rem;" id="${eventData.title}s"></div>
          ${eventData.title}
        </div>
        <div class="card-body" id="${eventData.title}">
          <p class="test"><strong>Tickets Left:</strong> ${eventData.tickets}</p>
          <p class="test"><strong>Date:</strong> ${eventData.date}</p>
          <p class="test"><strong>Time:</strong> ${eventData.time}</p>
          <p class="test"><strong>Location:</strong> ${eventData.location}</p>
          <p class="test"><strong>Description:</strong> ${eventData.description}</p>
        </div>
        <div class="card-footer">
          <span>Price: ₹${eventData.price}</span>
        </div>
      </div>
    `;
    // Append the card to the container
    eventsContainer.innerHTML += eventCard;
    // fetchBookedPersons(eventData.title);
  });
  loader.classList.remove('show-loader');
}

function redir(e){
  console.log(e.id);
  sessionStorage.setItem('title',e.id);
  window.location.href = './singleAdminEventView.html'
}


async function fetchBookedPersons(eventTitle){
  const email = sessionStorage.getItem('email');
  let persons = 0;
  const querySnapshot = await db.collection("bookings").doc(email).get();
  console.log(querySnapshot.data()?.bookings);
  querySnapshot.data()?.bookings.forEach((element)=>{
    console.log(element.numberOfBookings);
    if(element.title == sessionStorage.getItem('title')){
      persons = (persons + Number(element.numberOfBookings));
    }
  })
  console.log('total persons booked ',persons);
  if(persons != 0){
    document.getElementById(eventTitle+'s').style.display = 'block';
    document.getElementById(eventTitle+'s').innerText = `Booked for ${persons} Person(s)`;
  }
  loader.classList.remove('show-loader');
}



//    // Function to get the ID of the clicked element
//    function getElementId(event) {
//     const elementId = event.target.id; // Get the ID of the clicked element
//     alert("Clicked Element ID: " + elementId);
// }

// // Add event listeners to all clickable elements
// const elements = document.querySelectorAll('.clickable');
// elements.forEach(function(element) {
//     element.addEventListener('click', getElementId);
// });



// async function getAllDocuments() {
//     loader.classList.add('show-loader');
//     console.log("entered");
//     try {
//         const querySnapshot = await db.collection("userType").get();
//         console.log(querySnapshot);
//         // const dataOutput = document.getElementById("data-output");
      
//         // Loop through each document in the collection
//         querySnapshot.forEach((doc) => {
//             // doc.data() is the document's data
//             // dataOutput.innerHTML += `<p>Document ID: ${doc.id}, Data: ${JSON.stringify(doc.data())}</p>`;
//             const uType = doc.data().userType;
//             const Email = doc.data().email;
          
//             console.log(doc.data());
//             console.log(uType);
//             const email = sessionStorage.getItem('email');
//             if(email == Email && uType == 'admin'){
//                 console.log('matched');
//                 document.getElementById('addEvent').style.display = 'block';
//             }else{
//                 document.getElementById('addEvent').style.display = 'none';
//             }
//             // if()
//         });
//     } catch (error) {
//         console.error("Error getting documents: ", error);
//     }
// }

// getAllDocuments();


// Call the function to fetch events when the page loads
window.onload = fetchEvents();

