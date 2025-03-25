//hart split als je op dislike clickt
document.addEventListener("DOMContentLoaded", function () {
  function splitHeart() {
      const heart = document.querySelector(".heart-container");
      heart.classList.add("split");

      // Optioneel: Reset na animatie (na 1000 ms)
      setTimeout(() => {
          heart.classList.remove("split");
      }, 1000);
  }

  // Voeg de event listener toe aan de hart-container
  const heartContainer = document.querySelector(".heart-container");
  heartContainer.addEventListener('click', splitHeart);
});


// Hieronder komt de code voor het sorteren en filteren in opgeslagen artiesten
// Wacht totdat de DOM volledig is geladen
document.addEventListener('DOMContentLoaded', function() {
  // Maak een nieuwe List.js instance voor de artiestenlijst
  var opties = {
      valueNames: ['naam'], // Dit is de naam waarop we gaan zoeken en sorteren
      listClass: 'account-opgeslagen-artiest-grid' // Zorg ervoor dat je de juiste class gebruikt
  };

  var favorietenLijst = new List('favorieten', opties);

  // Zoekfunctie
  var zoekveld = document.querySelector('.search');
  zoekveld.addEventListener('input', function() {
      // Zoek op naam van de artiest
      favorietenLijst.search(zoekveld.value);
  });

  // Sorteerfunctie
  var sorteerknop = document.querySelector('.sort');
  sorteerknop.addEventListener('click', function() {
      // Sorteer de lijst op naam
      favorietenLijst.sort('naam', { order: 'asc' });
  });
});












