# Little artist machine
Welkom wat leuk dat je dit project bekijkt.

Dit is The little artist machine een interactieve website waarbij je nieuw kleine artiesten kan ontdekken. 

Je begint bij het startscherm en daar word je geleidt door een aantal vragen om de kunnen filteren tussen de verschillende schermen. Uiteindelijk kon je op een pagina terecht waar je als een soort tinder idee door de artiesten heen kan swipen en zo op kan slaan in je account. Daarbij kan je een snippet beluisteren van een van de bekendste nummers van de artiest en vind je zo nieuwe kleine artiesten. Ondertussen kan je ook de genres aanpassen, om zo een kijkje te krijgen van het aanbod in andere genres. 

# Stappenplan installeren

### Stap 1: 
Clone de code 

### Stap 2: 
Start de terminal en geef het command npm init, hierbij installeer je al de benodigde licenses die je nodig hebt. (Zie de gebruikte modueles om te zien welke wij gebruiken in dit project)

### Stap 3: 
Maak een .env bestand aan en voeg dit bij je git ignore

### Stap 3.1: 
Maak een account aan in MongoDB en zet de corresponderende link in je .env bestand onder de DB_HOST en voeg alle andere gegevens ook in, zie hieronder de lijst met benodigde gegevens.
Via de volgende link komt u op de MongoDB website.
https://www.mongodb.com/  

De volgende gegevens die je krijgt en in moet vullen zijn allemaal van belang om uiteindelijk in te kunnen loggen en artiesten te kunnen opslaan in de website.
DB_HOST= 

DB_NAME=

DB_USERNAME=

DB_PASSWORD=

DB_COLLECTION=

### Stap 3.2: 
Voeg ook een SECRET_SESSION= aan met een zelf bedachte wachtwoord. Dit heb je nodig om uiteindelijk de sessions van de gebruiker bij te kunnen houden.

### Stap 3.3: 
Maak een account aan via spotify web api voor developers en maak een eigen app, daarbij krijg je een clientID en een clientSecret en voeg deze ook bij je .env bestand. 
Doe dit via de volgende site: https://developer.spotify.com/documentation/web-api 

Deze gegevens heb je nodig om uiteindelijk de API te zien in de localhost.

CLIENT_ID:

CLIENT_SECRET: 

## Stap 4 
Zijn alle stappen hiervoor zorgvuldig en goed doorlopen, open dan weer de terminal en geef de command NPM start. Hiermee kan je de site in de localhost zien.

# Contributers 
Maks Breijer
David Jenniskens
Maja Wendelin
Sabrina Zuurbier


# Bronnen/Library's
In dit project kom je in aanraking met de volgende library's die zijn gebruikt:
* bcryptjs: Bcrypt zorgt er namelijk voor dat de gegeven wachtwoord gehasht wordt in onze database, dit creërt veiligheid voor de gegevens van de gebruiker. 
* cors: Backend als een soort API in de frontend te gebruiken.
* dotenv: Hierin worden alle wachtwoorden van de site in bewaard, zodat dit niet open een bloot op de server te zien is.
* ejs: Dit is om de templates mogelijk te maken voor de head, header en de footer.
* express: Deze gebruiken voor de routes om die te kunnen definieren en mogelijk te maken. 
* express-session: Deze gebruiken we om een gebruiker in een sessie te kunnen plaatsen en om te kijken of de gebruiker nog actief is op de website.
* helmet: Deze library's zorgt ervoor dat er niet zomaar elementen van buitenaf zomaar in de website gezet kunnen worden. 
* list.js: Dit gebruiken wij om in onze opgeslagen-artiesten pagina te kunnen filteren.
* mongodb: Dit gebruiken wij om bij onze database te kunnen komen waar wij onze gebruikers in opslaan en de favorieten die zij hebben en dat weer terug te kunnen halen.
* Multer: Hiermee kan je je eigen account een profielfoto geven en deze daarbij ook opslaan in de database.
* request: Om de token te kunnen ophalen in de backend voor de API.
* xss: Hierdoor halen ze de gegevens nog eens door een check om te kijken of er geen gekke tekens in staan. 

# Toekomst plan 
Onze toekomst plan is om nog een aantal funcionaliteiten toe te voegen, hierbij moet je denken de nieuwe opkomende concerten die die kleine artiesten dan geven waar je dan naartoe zou kunnen gaan. Daarnaast op sociale vlak zou je dan ook in aanraking kunnen komen met nieuwe mensen die die artiesten ook net hebben ontdekt en zo samen naar het concert kunnen gaan. 


