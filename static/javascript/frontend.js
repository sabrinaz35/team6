

console.log("Hallo wereld")


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

document.addEventListener('DOMContentLoaded', function() {
  // Configuratie voor List.js
  const options = {
    valueNames: ['name', 'genre']  // Specify the fields 'name' and 'genre' for List.js to search and sort.
                                   // These correspond to the class names of HTML elements in the list items.
                                   // For example, <span class="name">Artist Name</span> and <span class="genre">Genre</span>.
  };

  // Maak een nieuwe List.js lijst
  const artiestenList = new List('account-opgeslagen-artiest-grid', options);

  // Zoekfunctie
    // Zoeken naar overeenkomsten met de tekst die is ingevoerd
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', function() {
  artiestenList.search(searchInput.value);  // Zoeken naar overeenkomsten met de tekst die is ingevoerd
});

  // Sorteerfunctie
  const sortButton = document.querySelector('.sort');
  sortButton.addEventListener('click', () => {
    artiestenList.sort('name', { order: "asc" });  // Sorteer op naam in oplopende volgorde
  });
});
