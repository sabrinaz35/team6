console.log("Hallo wereld");

// Info van .env file toevoegen om .env te processen
require('dotenv').config() 

// Express webserver initialiseren
const express = require("express");
const app = express();
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
          //Er is hier nog wat mis, hij geeft namelijk nog aan dat de naam Undefined is
          res.send(`Welkom, ${gebruiker.name}! Account is succesvol aangemaakt.`)
        } else {
          //Dit werkt helemaal nog niet :(
          res.send(`Oops er ging iets fout.`)
        }
  })
  
 //Route voor de form   
    app.get('/aanmelden', (req, res) => {  
      res.render('aanmelden'); 
    })


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
    await client.close();
  }
}
run().catch(console.dir);










