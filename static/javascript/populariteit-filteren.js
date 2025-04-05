//functie om de value van de populariteits slider zichtbaar te maken

//maak een variabel aan voor de value display en de slider
let valueDisplay = document.getElementById('value')
let rangeSlider = document.getElementById('rangeSlider')

//zorgt ervoor dat de initiële waarde wordt weergegeven
valueDisplay.textContent = rangeSlider.value;

//update de waarde wanneer de slider beweegt
rangeSlider.addEventListener('input', function (event) {
    console.log("Slider moved! New value: ", event.target.value);
    valueDisplay.textContent = event.target.value;
});