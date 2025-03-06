console.log("Hallo wereld");

// Info van .env file toevoegen om .env te processen
require('dotenv').config() 

// Express webserver initialiseren
const express = require("express")
const app = express()
const port = 4000;

//static data access mogelijk maken
app.use('/static', express.static('static'))

//ejs templates opstarten
app.set('view engine', 'ejs');

//console log op welke poort je bent
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// maakt het mogelijk om informatie op te halen die in formulieren wordt opgegeven
app.use(express.urlencoded({extended: true})) 


//******* DATABASE **********

const { MongoClient, ServerApiVersion } = require('mongodb');
// URL aanmaken om met de database te connecten met info uit de .env file
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`
//MongoClient met een MongoClientOptions object aanmaken om de Stable API versie vast te leggen
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // client met server connecten (optional starting in v4.7)
    await client.connect();
    // ping sturen om een succesvol connectie te bevestigen
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // client closes bij finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// ******* ROUTES ********** 
app.get('/', function(req, res) {
  res.render('pages/index');
}); 


app.get('/inlog', function(req, res) { //Route van de Inlogpagina
  res.render('pages/inlog');
}); 




//**********Account aanmaken plus toevoegen in mongo**********
app.post('/add-account',async (req, res) => {

  //Je maakt een database aan in je mongo de naam van de collectie zet je tussen de "" 
    const database = client.db("klanten"); 
    const gebruiker = database.collection("user");
  
    //Om daadwerkelijk een _ID te krijgen maak je een doc aan met daarin de gegevens, in dit geval haalt hij de gegevens op uit de form
    const doc = { 
            name: req.body.name,
            emailadress: req.body.email,
            password: req.body.password
          }
  
    //Om het document toe te voegen in de database de volgende code
    const toevoegen = await gebruiker.insertOne(doc)

    //Even loggen om te checken of er een ID is aangemaakt
    console.log(`A document was inserted with the _id: ${toevoegen.insertedId}`);

    //De controle hieronder werkt nog niet helemaal, ik wil namelijk dat hij teruggeeft of het gelukt is
        if (doc){
          //Groet de gebruiker, naam wordt overgenomen van de form, niet van de database
          res.send(`Welkom, ${doc.name}! Account is succesvol aangemaakt.`)
        } else {
          //Dit werkt helemaal nog niet :(
          res.send(`Oops er ging iets fout.`)
        }
  })
  

 //Route voor de form van het acount aanmaken   
    app.get('/aanmelden', (req, res) => {  
      res.render('pages/aanmelden'); 
    })



//**********inloggen en check via mongo**********

app.post('/inlog-account',async (req, res) => {

  //Eerst de consts weer definieren vanuit welke database de gegevens gehaald moeten worden
  const database = client.db("klanten"); 
  const gebruiker = database.collection("user");

  //Een query aanmaken met daarin de naam om zo op te kunnen zoeken of die gebruiker bestaan op basis wat de gebruiker heeft ingevuld bij de form
  const query = { name: req.body.name }; 

  //Code om de user daadwerkelijk te vinden, met daarbij de overeenkomst van de query
  const user = await gebruiker.findOne(query);  

  //if else state met daarin dat de gebruiker overeen moet komen met het opgegeven wachtwoord + een respons terug geven aan de gebruiker
if (user) {
    if(user.password == req.body.password){
      res.send(`Welkom, ${user.name}! Inloggen was succesvol.`);
    } else {
      res.send('Wachtwoord komt niet overeen')
    }
} else {
  //Ook als niet gevonden word een response terug
    res.send("Gebruiker niet gevonden. Probeer opnieuw.");
}})

  //Connectie om de inlog form te laten zien
  app.get('/inlog', (req, res) => {  
    res.render('inlog');
  })



// ******** SPOTIFY API **********

//Dit stukje code hebben wij uit ChatGPT gehaald, omdat het oproepen van APIs vanuit spotify heel ingewikkeld is. 
//Ze willen een access token die elk uur geupdated moet worden. 
//Hiervoor hadden zij ook voorbeeld code op de website maar die werkte niet, omdat er zelf fouten inzaten zoals twee keer dezelfde variable declareren. 
//Ik snap de helft van deze code.

// request require om de volgende code van spotify werkend te maken
const request = require('request');

// inloggegevens voor de Spotify API App vanuit de .env laden
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// access token aanvragen
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      form: { grant_type: 'client_credentials' },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(`Error: ${response.statusCode}`);
      
      resolve(body.access_token);
    });
  });
}

// pitpull data van spotify opvragen
async function fetchData() {
  try {
    const accessToken = await getAccessToken(); // Access token opvragen voordat de data opgevraagd wordt
    
    const response = await fetch('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();
    console.log(data); // Log artist data

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// functie aanroepen
fetchData();


















// ******* ERROR HANDLING ********
//moet onder routes staan dus niet verschuiven!

// error 404 handling
app.use((req, res) => {
  // console log voor error 404
  console.error('404 error at URL: ' + req.url)
  // 404 status code als HTTP response sturen 
  res.status(404).send('404 error at URL: ' + req.url)
})

// error 500 handling
app.use((err, req, res) => {
  // console log voor error 500
  console.error(err.stack)
  // 500 status code als HTTP response sturen 
  res.status(500).send('500: server error')
})














