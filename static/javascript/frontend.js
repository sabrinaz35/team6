console.log("Hallo wereld")

//de access spotify access token van de backend ophalen
async function getAccessToken(){
    try{
        const response = await fetch('http://localhost:4000/token');
        const data = await response.json();
        return data.access_token;
    } catch(error){
        console.error("Token not fetched", error)
    }
}

//zoeken randomizen
function getRandomSearch() {
  // lijst van allemaal lowercase letters
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  // haal een random letter uit deze lijst
  const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
  // deze letter returnen als zoek term
  return randomCharacter;
}


// artist data van spotify opvragen en naar de artist spotlight op de homepagina overzetten
async function fetchData() {
  console.log('Fetching data')
  try {
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
    console.log("Full artist data:", data.artists.items);

    

    //sorteer de array en check naar artiesten die populariteit =< 10 hebben
    let kleineArtiesten = data.artists.items.filter(artist => artist.popularity > 10 && artist.popularity < 40);
    //defineert de eerste artiest uit het kleineArtiesten array
    let eersteArtiest = kleineArtiesten[0];

    //als er geen kleine artiesten in de 50 opgehaalde artiest data zitten stuur een foutmelding
    if(kleineArtiesten == ""){
      console.log("geen kleine Artiesten gevonden!")
    } else {
      console.log("kleine Artiesten zijn: " + JSON.stringify(kleineArtiesten, null, 2))


      //artist spotlight op de homepagina

      //de eerste kleine artiest uit het kleineArtiesten array word gebruikt voor de artist spotlight op de homepage
      document.getElementById('artiestinformatie').innerText = `${eersteArtiest.name} - ${eersteArtiest.followers.total} volgers`;
      //image vervangen door foto van spotfy artiest
      document.getElementById('artiestfoto').src = `${eersteArtiest.images[0].url}`;
      //er wordt van spotify geen beschrijving gegeven dus als er geen artiest word gevonden haal de beschrijving weg
      document.getElementById('artiestbeschrijving').innerText = "";

      //code voor de like button die dan de artiesten id meegeeft aan de button en daarna like doorgeeft aan de data base
      document.getElementById('favoInput').value=eersteArtiest.id
      //Andere gegevens ook meegeven aan naar de mongodb database
      document.getElementById("artistNameInput").value = eersteArtiest.name;
      document.getElementById("artistGenreInput").value = eersteArtiest.genres.join(", "); // Genre als string
      document.getElementById("artistFollowersInput").value = eersteArtiest.followers.total;
      document.getElementById("artistFotoInput").value = eersteArtiest.images[0].url;
      console.log(eersteArtiest.id)
    }
    

  } catch (error) {
    console.error('Error fetching data:', error);
  }
 
}

// functie aanroepen
fetchData();

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



//functie om de value van de populariteits slider zichtbaar te maken

//maak een variabel aan voor de value display en de slider
let valueDisplay = document.getElementById('value')
let rangeSlider = document.getElementById('rangeSlider')

//zorgt ervoor dat de initiële waarde wordt weergegeven
valueDisplay.innerHTML = rangeSlider.value;

//update de waarde wanneer de slider beweegt
rangeSlider.addEventListener('input', function () {
    console.log("Slider moved! New value: ", rangeSlider.value);
    valueDisplay.innerHTML = rangeSlider.value;
});










