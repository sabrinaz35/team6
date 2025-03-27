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


//Activeren van de helmet module EN alle bronnen van ander websites worden toegestaan
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"], // Voeg Swiper CDN toe aan scriptSrc
        connectSrc: ["'self'", "https://api.spotify.com", "http://localhost:4000"], // API calls naar Spotify en backend toestaan
        frameSrc: ["'self'", "https://open.spotify.com"], // Spotify playlist embeds toestaan
        imgSrc: ["'self'", "data:", "https://i.scdn.co"], // Foto's toestaan van de door Spotify gegeven bron
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"], // Voeg Swiper CDN toe aan styleSrc
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
  
    //Om daadwerkelijk een _ID te krijgen maak je een doc aan met daarin de gegevens, in dit geval haalt hij de gegevens op uit de form
    const doc = { 
        name: xss(req.body.name),            
        emailadress: xss(req.body.email), 
        //Xss is niet nodig voor de password omdat daar al de bcrypt voor gebruikt wordt
        password: hashedPassword,
        profielFoto: (req.file.filename),
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
      req.session.user = user
      res.render("pages/profiel", { user: req.session.user });
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
    //, {user: req.session.user}
  }
});


//**********artiesten opslaan in mongodb**********
//ophalen pagina + het connecten van de pagina aan de database, zodat deze ook de gegevens kan zien
app.get("/opgeslagen-artiesten", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/profiel");
  }
 
  const database = client.db("klanten");
  const gebruiker = database.collection("user");

  // Haal de gebruiker op basis van de sessiegegevens
  const query = { emailadress: req.session.user.emailadress };
  const user = await gebruiker.findOne(query);

  if (user) {
    console.log("gebruiker gevonden");
    // return res.status(404).send("Gebruiker gevonden");
    res.render("pages/opgeslagen-artiesten", { user}); // Zorg ervoor dat je een about.ejs bestand hebt in de 'views/pages' map
  } else {
    res.send("Gebruiker is niet gevonden :(")
  }

});

//Als het goed is moet :artiest dan vervangen worden door iets van de api
//Het klopt nog niet helemaal 100% en ik weet niet of dat aan de code ligt voor de session
app.post("/opgeslagen-artiesten",async (req, res) => {
  const database = client.db("klanten")
  const gebruiker = database.collection("user")

  const query = { emailadress: req.session.user.emailadress };
  const user = await gebruiker.findOne(query)

//Een object met daarin alle info wat naar de mongodb gestuurd moet worden, dit komt overeen met wat in de index staat en de frontend
  const artiestData = {
    id: req.body.artistId,
    naam: req.body.artistName,
    genre: req.body.artistGenre,
    volgers: parseInt(req.body.artistFollowers), // Zorg dat dit een getal is
    images: req.body.artistFoto
  };
  
  if (user) {
    console.log("Gebruiker gevonden:", user);
    await gebruiker.updateOne(
      { emailadress: req.session.user.emailadress},
      //Uiteindelijk alle artiestendata doorsturen naar database
      { $push: { favorieten:  artiestData } }
    );
    console.log(user)
  } else {
    console.log('of niet')
    return res.status(404).send("Gebruiker niet gevonden");
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

// error 404 handling
app.use((err, req, res, next) => {
  // console log voor error 404
  console.error("404 error at URL: " + req.url);
  // 404 status code als HTTP response sturen
  res.status(404).send("404 error at URL: " + req.url);

  next();
});

// error 500 handling
app.use((err, req, res, next) => {
  // console log voor error 500
  console.error(err.stack);
  // 500 status code als HTTP response sturen
  res.status(500).send("500: server error");

  next();
});

