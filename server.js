console.log("Hallo wereld");

// Info van .env file toevoegen om .env te processen.
require("dotenv").config();

// Express webserver initialiseren
const express = require("express");
const app = express();
const helmet = require("helmet");
const port = 4000;

const xss = require('xss');

var sessions = require('express-session')

const bcrypt = require ("bcryptjs")

const multer = require("multer")
//Hier gaan de ingevoerde foto's naartoe
const upload = multer({dest: 'static/upload/'})


//static data access mogelijk maken
app.use("/static", express.static("static"));

// header script
app.use(express.static('public'));

//APi token krijgen in de backenc
async function getAccessToken(){
  try{
      const response = await fetch('http://localhost:4000/token');
      const data = await response.json();
      return data.access_token;
  } catch(error){
      console.error("Token not fetched", error)
  }
}

//ApI aanspreken in de backend
async function getArtist(artistId) {
  try {
    // Access token opvragen voordat de data opgevraagd wordt
    const accessToken = await getAccessToken(); 

    //krijg een random array aan artiesten met een random begin letter
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }}); 

      console.log("Spotify API response status:", response.status)// Debugging
      //alle artiesten data loggen
      const data = await response.json();
      // console.log("Artist data:", data.artistsId.items)
      console.log(data.name)
      return data

  } catch (error) {
      console.error('Error fetching data:', error);
  }
  
}

//Activeren van de helmet module EN alle bronnen van ander websites worden toegestaan
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // inline scripts toestaan
        connectSrc: ["'self'", "https://api.spotify.com", "http://localhost:4000"], // API calls naar Spotify en backend toestaan
        frameSrc: ["'self'", "https://open.spotify.com"], // Spotify playlist embeds toestaan
        imgSrc: ["'self'", "data:", "https://i.scdn.co"], // fotos toestaan van de door spotify gegeven bron
        styleSrc: ["'self'", 'https://fonts.googleapis.com'], //fonts van google toestaan
      },
    },
  })
);

//Middleware Sessions bij het inloggen
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }),
);


//ejs templates opstarten
app.set("view engine", "ejs");

//console log op welke poort je bent
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// maakt het mogelijk om informatie op te halen die in formulieren wordt opgegeven
app.use(express.urlencoded({ extended: true }));



//******* DATABASE **********
const { MongoClient, ServerApiVersion } = require("mongodb");
// URL aanmaken om met de database te connecten met info uit de .env file //process klopt wel alleen komt het uit de extensie wat Eslint niet kan lezen
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;
//MongoClient met een MongoClientOptions object aanmaken om de Stable API versie vast te leggen
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // client met server connecten (optional starting in v4.7)
    await client.connect();
    // ping sturen om een succesvol connectie te bevestigen
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // client closes bij finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ******* ROUTES **********
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/inlog", function (req, res) {
  //Route van de Inlogpagina
  res.render("pages/inlog");
});

app.get("/about", (req, res) => {
  res.render("pages/about"); // Zorg ervoor dat je een about.ejs bestand hebt in de 'views/pages' map
});


app.get('/tuneder', (req, res) => {
    res.render('pages/tuneder'); // Zorg ervoor dat "tuneder.ejs" bestaat in de map views/pages/
  });

app.get("/contact", (req, res) => {
  res.render("pages/contact"); // Zorg ervoor dat je een contact.ejs bestand hebt
});

app.get("/filter-populariteit", function (req, res) {
  res.render("pages/filter-populariteit");
});

app.get("/filter-genre", function (req, res) {
  res.render("pages/filter-genre");
});


//**********Account aanmaken plus toevoegen in mongo**********
app.post('/add-account',upload.single('profielFoto'), async (req, res) => {
  //Je maakt een database aan in je mongo de naam van de collectie zet je tussen de "" 
    const database = client.db("klanten"); 
    const gebruiker = database.collection("user");

    //const aanmaken om een hash te creëren voor het wachtwoord
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let filename 

  if (req.file && req.file.filename) {
    filename = req.file.filename
  } else {
    filename = "profiel-placeholder.png" //een afbeelding toevoegen..
  }

    //Om daadwerkelijk een _ID te krijgen maak je een doc aan met daarin de gegevens, in dit geval haalt hij de gegevens op uit de form
    const doc = { 
        name: xss(req.body.name),            
        emailadress: xss(req.body.email), 
        //Xss is niet nodig voor de password omdat daar al de bcrypt voor gebruikt wordt
        password: hashedPassword,
        profielFoto: (filename),
        //alvast een lege array ter voorbereiding 
        favorieten: [ ], 
      }
  
    //Om het document toe te voegen in de database de volgende code
    const toevoegen = await gebruiker.insertOne(doc)

    //Even loggen om te checken of er een ID is aangemaakt
    console.log(`A document was inserted with the _id: ${toevoegen.insertedId}`);

    //controleren of er daadwerkelijk een user is toegevoegd
        if (toevoegen.insertedId){
          //De nieuwe gebruiker vinden in de database
          const newUser = await gebruiker.findOne({ emailadress: doc.emailadress });

          //controleren of de gebruiker bestaat
          if (newUser) {
            console.log("Gebruiker is gevonden na het toevoegen");
          }
          //de gebruiker in een session zetten
          req.session.user = newUser 

          //Na het aanmaken van de session meteen doorsturen naar profiel pagina met daarin de gegevens van de gebruiker
          res.redirect("/profiel");
        } else {
          //Dit werkt helemaal nog niet :(
          res.send(`Oops er ging iets fout.`)
        }
  })


//Route voor de form van het acount aanmaken
app.get("/aanmelden", (req, res) => {
  res.render("pages/aanmelden");
});


//**********inloggen en check via mongo**********
app.post("/inlog-account", async (req, res) => {
  let artiesten = []
  //Eerst de consts weer definieren vanuit welke database de gegevens gehaald moeten worden
  const database = client.db("klanten");
  const gebruiker = database.collection("user");

  //Een query aanmaken met daarin de email om zo op te kunnen zoeken of die gebruiker bestaan op basis wat de gebruiker heeft ingevuld bij de form
  const query = { emailadress: xss(req.body.email) };

  //Code om de user daadwerkelijk te vinden, met daarbij de overeenkomst van de query
  const user = await gebruiker.findOne(query);

  //if else state met daarin dat de gebruiker overeen moet komen met het opgegeven wachtwoord + een respons terug geven aan de gebruiker
  if (user) {
    // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord in de database
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      // Als het wachtwoord overeenkomt, start de sessie en daarin slaat hij user op
   // fetch data van api
      for (const favoriet of user.favorieten) {
        const artiest = await getArtist(favoriet)
        artiesten.push(artiest)
      }
      req.session.user = user
      res.render("pages/profiel", { user: req.session.user, artiesten });
    } else {
      // Als het wachtwoord niet overeenkomt
      res.send("Wachtwoord komt niet overeen");
    }
  } else {
    // Als de gebruiker niet wordt gevonden

    res.send("Gebruiker niet gevonden. Probeer opnieuw.");
  }
});

//Functie van het account scherm, als de account al bestaat dan naar profiel en anders naar het inlogscherm leiden.
app.get("/profiel", (req, res) => {
  if (req.session.user) {
    res.render("pages/profiel", { user: req.session.user });
  } else {
    res.render("pages/inlog");
  }
});


//**********artiesten opslaan in mongodb**********
//ophalen pagina + het connecten van de pagina aan de database, zodat deze ook de gegevens kan zien
app.get("/opgeslagen-artiesten", async (req, res) => {
 
  let artiesten = []

  if (!req.session.user) {
    return res.redirect("/inlog");
  }
 
  const database = client.db("klanten");
  const gebruiker = database.collection("user");

  // Haal de gebruiker op basis van de sessiegegevens
  const query = { emailadress: req.session.user.emailadress };
  const user = await gebruiker.findOne(query);

  if (user) {
    console.log("gebruiker gevonden");

    // fetch data van api
    for (const favoriet of user.favorieten) {
      const artiest = await getArtist(favoriet)
      artiesten.push(artiest)
    }

    // return res.status(404).send("Gebruiker gevonden");
    res.render("pages/opgeslagen-artiesten", { user, artiesten}); // Zorg ervoor dat je een about.ejs bestand hebt in de 'views/pages' map
  } else {
    // res.send("Gebruiker is niet gevonden")
    res.render("pages/inlog");
  }

});


//Als het goed is moet :artiest dan vervangen worden door iets van de api
//Het klopt nog niet helemaal 100% en ik weet niet of dat aan de code ligt voor de session
app.post("/opgeslagen-artiesten",async (req, res) => {
 console.log("Ontvangen artiest ID:", req.body.artistId); 

  if (!req.session.user) {
    return res.redirect("/inlog"); // Voorkomt fout als er geen sessie is
  }
 
  const database = client.db("klanten")
  const gebruiker = database.collection("user")

  const query = { emailadress: req.session.user.emailadress };
  const user = await gebruiker.findOne(query)

//Een object met daarin alle info wat naar de mongodb gestuurd moet worden, dit komt overeen met de api
  const artiestData = req.body.artistId
  const index = user.favorieten.indexOf(artiestData);

  console.log (index)
  
  if (user) {
    console.log("Gebruiker gevonden:", user);
    //Als de gebruiker bestaat en de index is afwezig, dan moet hij die eruit halen.
    if  (artiestData == ""){
      console.log("Dit is de milo laat het lukken placholder")
      return
    } else {
        if (index >= 0){
          user.favorieten.splice(index, 1)
          await gebruiker.updateOne(
            { emailadress: req.session.user.emailadress},
            //Uiteindelijk alle artiestendata doorsturen naar database
            { $set: { favorieten: user.favorieten}})
          console.log("Artiest is verwijdert uit favorieten") 
        } else {
              //Als de gebruiker bestaat en de index is aanwezig, dan moet hij die toevoegen
          await gebruiker.updateOne(
            { emailadress: req.session.user.emailadress},
            //Uiteindelijk alle artiestendata doorsturen naar database
            { $push: { favorieten:  artiestData } },
            console.log("Artiest is toegevoegd")
          );
        }}}
  else {
    // console.log('of niet')
    // return res.status(404).send("Gebruiker niet gevonden");
    res.render("pages/inlog");
  }
  res.redirect("/") 
});



// ******** uitloggen **********

app.get("/uitloggen", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Fout bij uitloggen:", err);
      return res.send("Er ging iets mis bij het uitloggen.");
    }
    res.redirect("/inlog");
  });
});




//*******  VRAGEN EN KEUZE OPSLAAN ********
//populariteitswaarde opslaan
// populariteit opslaan
app.post("/populariteit-kiezen", async (req, res) => {
  let populariteit = req.body.populariteit; // slider value ophalen
  
  // data mergen
  req.session.user = req.session.user || {};  
  req.session.user.valuePopulariteit = populariteit;

  const database = client.db("klanten")
  const gebruiker = database.collection("user")

  const query = { emailadress: req.session.user.emailadress };
  const user = await gebruiker.findOne(query)

  console.log("Saved popularity value:", populariteit);

  res.render("pages/tuneder", {user}); // render tuneder pagina
});



app.get("/api/populariteit", (req, res) => {
  res.json({ valuePopulariteit: req.session.user});
});



//gekozen genres opslaan

app.post("/genre-kiezen", (req, res) => {
  // alle genres ophalen en lege array als geen genres geselecteerd zijn
  let selectedGenres = req.body.genre || []; 

  // nieuwe data mergen aan session die al bestaat
  req.session.user = req.session.user || {};  //checken of een req.session.user bestaat
  req.session.user.selectedGenres = selectedGenres;

  console.log("Saved genres:", selectedGenres);

  // Render the next page
  res.render("pages/filter-populariteit");
});



app.get("/api/genres", (req, res) => {
  console.log("Session data:", req.session)
  if (req.session.user && req.session.user.selectedGenres) {

    console.log("Genres uit session:", req.session.user.selectedGenres);
    res.json({ selectedGenres: req.session.user.selectedGenres });
  } else {
    //geen genres selected, dan return lege array
    console.log("Geen genres gevonden in session");
    res.json({ selectedGenres: [] });
  }
});



// ******** SPOTIFY API **********

//cors gebruiken om frontend requests naar de backend mogelijk te maken
const cors = require("cors");
app.use(cors());

// request require om de volgende code van spotify werkend te maken
const request = require("request");

// inloggegevens voor de Spotify API App vanuit de .env laden
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

//Dit stukje code hebben wij uit ChatGPT gehaald, omdat het oproepen van APIs vanuit spotify heel ingewikkeld is.
//Ze willen een access token die elk uur geupdated moet worden.
//Hiervoor hadden zij ook voorbeeld code op de website maar die werkte niet, omdat er zelf fouten inzaten zoals twee keer dezelfde variable declareren.
//Ik snap de helft van deze code.

// access token aanvragen, die later van de frontend voor de API call kan worden gebruikt
app.get("/token", (req, res) => {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: { grant_type: "client_credentials" },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (error) {
      return res.status(500).json({ error: "Failed to get token" });
    }
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ error: body });
    }
    
    // Send the token to the frontend
    res.json({ access_token: body.access_token });
  });
});


// ******* ERROR HANDLING ********
//moet onder routes staan dus niet verschuiven!
// Middleware to handle not found errors - error 404
app.use((err, req, res) => {
  // log error to console
  console.error('404 error at URL: ' + req.url)
  // send back a HTTP response with status code 404
  res.status(404).send('404 error at URL: ' + req.url)
  console.error(err.stack)
})

// error 500 handling
app.use((err, req, res) => {
  // console log voor error 500
  console.error(err.stack);
  // 500 status code als HTTP response sturen
  res.status(500).send("500: server error");
});