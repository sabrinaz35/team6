

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




//random genres genereren uit spotify API en deze naar de filter-genre pagina overzetten

async function getGenres () {
  console.log("probeer genres op te halen")
  try{
    // Access token opvragen voordat de data opgevraagd wordt
    const accessToken = await getAccessToken(); 
    //krijg een random array aan artiesten met een random begin letter
    const response = await fetch(`https://api.spotify.com/v1/search?q=${getRandomSearch()}&type=artist&limit=50`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    
    console.log("Spotify API response status:", response.status); // Debugging
    //alle artiesten data loggen
    const data = await response.json();

    const filteredGenres = data.artists.items
    .filter(artist => artist.genres.length > 0) // filter alle genre arrays die leeg zijn
    .flatMap(artist => artist.genres); // laat alle genres in een grote array zien 
  
    console.log("Genres:", filteredGenres); 

    
    const randomGenres = [];
    let i = 0;

    while (i < 4) {
      const random = Math.floor(Math.random() * filteredGenres.length);
      
      if (!randomGenres.includes(filteredGenres[random])) {
        randomGenres.push(filteredGenres[random]);
        i++;
      }
    }

    console.log("Random genres:", randomGenres);
   
    //random genres aangeven op de genre filter pagina
    document.getElementById('genre1Label').innerText = randomGenres[0];
    document.getElementById('genre2Label').innerText = randomGenres[1];
    document.getElementById('genre3Label').innerText = randomGenres[2];
    document.getElementById('genre4Label').innerText = randomGenres[3];

    //Gegevens ook meegeven aan de input voor de mongodb database
    document.getElementById("genre1").value = randomGenres[0];
    document.getElementById("genre2").value = randomGenres[1]; 
    document.getElementById("genre3").value = randomGenres[2];
    document.getElementById("genre4").value = randomGenres[3];

    //uncheck de checkboxes bij het opnieuw laden
    document.getElementById("genre1").checked = false;
    document.getElementById("genre2").checked = false; 
    document.getElementById("genre3").checked = false;
    document.getElementById("genre4").checked = false;

  } catch {
    console.error('Error fetching genres:', error);
  }
}

//roep de getGenres functie aan om een eerste keuze aan genres te krijgen als je de pagina opent
getGenres();

//roep de functie opnieuw aan om ander genres te krijgen
const genreLaden = document.querySelector("#genreLaden");
genreLaden.addEventListener('click', getGenres);

//carousel 
console.log("1")
const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

