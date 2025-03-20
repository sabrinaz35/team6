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
      //laat genres van de artiest zien
      if(eersteArtiest.genres == ""){
        document.getElementById('artiestgenres').innerText = ""
      } else {
        document.getElementById('artiestgenres').innerText = `${eersteArtiest.genres[0]}`;
      }
      
      //laat link naar spotify zien
      document.getElementById('artiestlink').href = `${eersteArtiest.external_urls.spotify}`;




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


//deze functie gebruiken om de artiest op basis van de zoekcriteria te vinden
async function artiestZoeken(){
  try{
    //Spotify data opvragen

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


    //data van populariteitsvraag uit ejs halen
    let populariteitLaag =
    let populariteitHoog =

    //data van genres uit ejs halen
    let genresFilter = 

    let gevondenArtiest = data.artists.items.filter(artist => artist.popularity > populariteitLaag && artist.popularity < populariteitHoog && artist.genres.includes(genresFilter));


    //source van de iframe te vervangen naar de top tracks van de gevonden artiest
    let artiestID = gevondenArtiest.id;
    document.getElementById("gevondenArtiestIframe").src = `https://open.spotify.com/embed/artist/${artiestID}?utm_source=generator`

  } catch (error) {
    console.error("error fetching artist source")
  }
}



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









