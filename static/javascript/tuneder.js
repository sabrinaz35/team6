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


//zoek artiest op basis van criteria
async function artiestZoeken() {
    try {
        console.log("probeer artiest te zoeken");

        // Access token opvragen voordat de data opgevraagd wordt
        const accessToken = await getAccessToken(); 

        // Populariteit ophalen uit de backend als API call
        let sliderPopulariteit; 
        async function fetchPopulariteit() {
            try {
            const response = await fetch("/api/populariteit");
            const data = await response.json();
            sliderPopulariteit = parseInt(data.valuePopulariteit.valuePopulariteit);
            console.log("Session Popularity Value:", sliderPopulariteit);
            } catch (error) {
            console.error("Error fetching popularity:", error);
            }
        }
        await fetchPopulariteit();
    
        // Genres ophalen uit de backend als API call
        let geselecteerdeGenres;
        async function fetchGenres() {
            try {
            const response = await fetch("/api/genres");
            const data = await response.json();
            geselecteerdeGenres = data.selectedGenres;
            console.log("geselecteerde Genres:", geselecteerdeGenres);
            } catch (error) {
            console.error("Error fetching genres:", error);
            }
        }
        await fetchGenres();
    
        let gevondenArtiest = null;
    
        // Probeer maximaal 8 keer een artiest te vinden
        for (let i = 0; i < 8; i++) {
            let loadingAnimation = document.getElementById("loading");
            loadingAnimation.classList.remove("hide");

            console.log(`Zoekpoging ${i + 1}...`);
    
            // Nieuwe artiesten ophalen met een willekeurige zoekletter
            const response = await fetch(`https://api.spotify.com/v1/search?q=${getRandomSearch()}&type=artist&limit=50`, {
            headers: { Authorization: 'Bearer ' + accessToken }
            });
    
            console.log("Spotify API response status:", response.status);
            const data = await response.json();
    
            // Artiesten filteren op populariteit en genres
            let gevondenArtiesten = data.artists.items.filter(artist => artist.popularity <= sliderPopulariteit && artist.popularity > 10 && geselecteerdeGenres.some(genre => artist.genres.includes(genre)));
    
            console.log("Gefilterde artiesten:", gevondenArtiesten);
    
            if (gevondenArtiesten.length > 0) {
            // Kies een willekeurige artiest uit de gefilterde lijst
            const random = Math.floor(Math.random() * gevondenArtiesten.length);
            gevondenArtiest = gevondenArtiesten[random];
            console.log("Gevonden artiest:", gevondenArtiest);
            break; // Stop de loop als een artiest is gevonden
            }
        }
    
        if (!gevondenArtiest) {
            //loading animation stoppen
            let loadingAnimation = document.getElementById("loading");
            loadingAnimation.classList.add("hide");

            console.error("Geen geschikte artiest gevonden na 5 pogingen.");
            //verbergen van Iframe als er geen artiest gevonden wordt
            document.getElementById("artiestIframe").style.display = 'none';
            //dialog laten verschijnen
            const dialog = document.getElementById("errorDialog")
            dialog.showModal();
    
            const closeButton = document.querySelector("dialog button");
    
            closeButton.addEventListener("click", () => {
            dialog.close();
            });
    
            return;
        } else {
            //loading animation stoppen
            let loadingAnimation = document.getElementById("loading");
            loadingAnimation.classList.add("hide");document.getElementById("loading").addClass('hide');
            // Zet de artiest in de iframe
            let artiestID = gevondenArtiest.id;
            document.getElementById("artiestIframe").src = `https://open.spotify.com/embed/artist/${artiestID}?utm_source=generator`;
        }
    
        
        
        } catch (error) {
        console.error("Error fetching artist source", error);
    }
}

  //als je op zoek artiest klikt wordt er gezocht
const zoekArtiest = document.getElementById("zoekArtiest");
zoekArtiest.addEventListener("click", artiestZoeken);

//zoek automatisch zodra tuneder pagina opent
document.addEventListener("DOMContentLoaded", async () => {
    await artiestZoeken();
});

