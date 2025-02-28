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










