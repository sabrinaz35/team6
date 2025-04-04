

console.log("Hallo wereld")


var options = {
    // de classes van de h2's en p's (daarin gaat gezocht worden naar matches)
    valueNames: [ 'name' ]
  };
  
  
  // Stap 3.
  var charactersList = new List('theList', options);
  
// Like hartje index en opgeslagen pagina 
//dit klopt nog niet helamaal oops
let witHart = document.getElementsByClassName('likeHartje')

witHart.onclick = veranderKleur;

function veranderKleur (){

 witHart.classList.toggle ("roodHart");
}

