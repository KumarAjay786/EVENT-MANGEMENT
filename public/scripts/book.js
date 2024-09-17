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
  const e = document.getElementById('emailName');
  console.log(sessionStorage.getItem('email'),'aaa');
  console.log(e,"e");
  
 document.getElementById('emailName').innerHTML = `${email.split('@')[0]}`
  
  // document.getElementById('uName').value = sessionStorage.getItem('email');

function pay() {
    const loader = document.getElementById('loader');
    loader.classList.add('show-loader');
    finalBooking();
    // setTimeout(() => {
    //     sessionStorage.setItem('isBook','true');
    //     // window.location.href = './event.html'
    //     loader.classList.remove('show-loader');
    // }, 3000); 
}

function confirmBooking() {
    document.getElementById('bookingPerson').style.display = 'none';
    document.getElementById('paymentGateway').style.display = 'block';
    // console.log(person.style);
    const selectElement = document.getElementById("people");
    const numberOfPeople = selectElement.value;
    sessionStorage.setItem('person',numberOfPeople);
    const confirmationMessage = document.getElementById("confirmationMessage");
    console.log(document.getElementById('eventTitleName'));

    confirmationMessage.textContent = `You have booked for ${numberOfPeople} ${numberOfPeople == 1 ? 'person' : 'people'}.`;
}
async function finalBooking(){
    let arr = [];
    let obj = {
        bookingId: Math.floor(Math.random() * 10000000000),
        bookingDate: `${new Date()}`,
        numberOfBookings: sessionStorage.getItem('person'),
        title: sessionStorage.getItem('title')
    }
    console.log(obj);
    const email = sessionStorage.getItem('email');
    const querySnapshot = await db.collection('bookings').doc(email).get();
    console.log(querySnapshot.data());
    if(querySnapshot.data()){
        alert('data found');
        arr = querySnapshot.data().bookings;
        // obj.
        arr.push(obj);
        const inertObj = {
            bookings: arr,
            comments: []
        }
        console.log(inertObj);
        insertToFirebase(inertObj);
    }else{
        alert('data not found');
        arr.push(obj);
        const inertObj = {
            bookings: arr,
            comments: []
        }
        console.log(inertObj);
       insertToFirebase(inertObj);
    }
}

async function insertToFirebase(obj){
    const email = sessionStorage.getItem('email');
    await db.collection('bookings').doc(email).set(obj)
    .then(() => {
        console.log('qqqqqqqqqqqqqqq');
        // showMessage('success', 'Event added successfully!');
        // window.location.href = './eventDiscovery.html'
        updateTotalTicketsForAdmin();
        console.log('qqqqqqqqqqqqqqq');
        form.reset();
        // setTimeout(()=>{
        // },4000)
      })
      .catch((error) => {
        // showMessage('error', `Error adding event: ${error.message}`);
      })
      .finally(() => {
        // Hide loader after operation completes
        loader.classList.remove('show-loader');
      });
    
      return false; // Prevent form submission
}

async function updateTotalTicketsForAdmin(){
    const querySnapshot = await db.collection('events').doc('adminEvents').get();
    // console.log(sessionStorage.getItem('title'));
    let mainObj = querySnapshot.data();
    console.log(mainObj);
    const adminEventsData = mainObj.events;
    adminEventsData.forEach(element => {
        if(element.title == sessionStorage.getItem('title')){
            element.tickets = element.tickets - sessionStorage.getItem('person');
            // console.log(element.tickets);
            // console.log(sessionStorage.getItem('person'));
        }
    });
    console.log(adminEventsData);
    mainObj.events = adminEventsData;
    console.log(mainObj);
    await db.collection('events').doc('adminEvents').set(mainObj)
    .then(() => {
        console.log('qqqqqqqqqqqqqqq');
        // showMessage('success', 'Event added successfully!');
        window.location.href = './event.html'
        updateTotalTicketsForAdmin();
        console.log('qqqqqqqqqqqqqqq');
        form.reset();
        // setTimeout(()=>{
        // },4000)
      })
      .catch((error) => {
        // showMessage('error', `Error adding event: ${error.message}`);
      })
      .finally(() => {
        // Hide loader after operation completes
        loader.classList.remove('show-loader');
      });
    
      return false; // Prevent form submission
}