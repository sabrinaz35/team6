

console.log("Hallo wereld")


// var options = {
//     // de classes van de h2's en p's (daarin gaat gezocht worden naar matches)
//     valueNames: [ 'name' ]
//   };
  
  
//   // Stap 3.
//   var charactersList = new List('theList', options);

// // Like hartje index en opgeslagen pagina 
// //dit klopt nog niet helamaal oops
// let witHart = document.getElementsByClassName('likeHartje')

// witHart.onclick = veranderKleur;

// function veranderKleur (){

//  witHart.classList.toggle ("roodHart");
// }


//hamburger menu
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeBtn');
  
  console.log("Hamburger element:", hamburger);
  console.log("Mobile menu element:", mobileMenu);
  console.log("Close button element:", closeBtn);
  // Toggle voor het openen/afsluiten van het mobiele menu
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Sluit het menu wanneer je op het kruisje klikt
  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});





