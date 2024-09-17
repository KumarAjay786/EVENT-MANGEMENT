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
  
  // Add event to Firestore
  async function addEvent() {
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
  
    if (!title || !description || !date || !time || !location || !price || !tickets) {
      showMessage('error', 'All fields are required!');
      loader.classList.remove('show-loader'); // Hide loader on error
      return false;
    }


    const querySnapshot = await db.collection("events").doc('adminEvents').get();
    // const adminEvents = [];
    // const comments = [];
    console.log(querySnapshot.exists);
    if(querySnapshot.exists){
       console.log("if part");
       console.log(querySnapshot.data().events);
       console.log(querySnapshot.data().comments);
       const adminEvents = querySnapshot.data().events;
       const comments = querySnapshot.data().comments;
       let eventObj = {
        title: title,
        description: description,
        date: date,
        time: time,
        location: location,
        price: parseFloat(price),
        tickets: tickets
      }
      // let commentObj = {
      //   email: title,
      //   comment: description,
      //   date: date,
      //   time: time,
      //   location: location
      // }
      adminEvents.push(eventObj);
      // comments.push(commentObj);
      let insertObj = {
        events: adminEvents,
        comments: comments
      }
      db.collection("events").doc('adminEvents').set(
        insertObj
      )
        .then(() => {
          showMessage('success', 'Event added successfully!');
          form.reset();
          setTimeout(()=>{
            window.location.href = './adminEvents.html';
          },4000)
        })
        .catch((error) => {
          showMessage('error', `Error adding event: ${error.message}`);
        })
        .finally(() => {
          // Hide loader after operation completes
          loader.classList.remove('show-loader');
        });
      
        return false; // Prevent form submission
    }else{
    const adminEvents = [];
    const comments = [];
      let eventObj = {
        title: title,
        description: description,
        date: date,
        time: time,
        location: location,
        price: parseFloat(price),
        tickets:tickets
      }
      // let commentObj = {
      //   email: title,
      //   comment: description,
      //   date: date,
      //   time: time,
      //   location: location
      // }
      adminEvents.push(eventObj);
      // comments.push(commentObj);
      let insertObj = {
        events: adminEvents,
        comments: comments
      }
      console.log(insertObj,"insert");
        db.collection("events").doc('adminEvents').set(
      insertObj
    )
      .then(() => {
        showMessage('success', 'Event added successfully!');
        form.reset();
        setTimeout(()=>{
          window.location.href = './adminEvents.html';
        },4000)
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
