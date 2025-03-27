

console.log("Hallo wereld")


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



// Like hartje index en opgeslagen pagina 
//dit klopt nog niet helamaal oops
let witHart = document.getElementsByClassName('likeHartje')

witHart.onclick = veranderKleur;

function veranderKleur (){

 witHart.classList.toggle ("roodHart");
}




