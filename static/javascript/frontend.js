

console.log("Hallo wereld")


//hamburger menu
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeBtn');
  
  console.log("Hamburger element:", hamburger);
  console.log("Mobile menu element:", mobileMenu);
  console.log("Close button element:", closeBtn);
  // Toggle voor het openen/afsluiten van het mobiele menu
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Sluit het menu wanneer je op het kruisje klikt
  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});




