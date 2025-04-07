document.addEventListener('DOMContentLoaded', function () {
  console.log("Hallo wereld");

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeBtn');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });

  // List.js configuratie
  const options = {
    valueNames: ['name', 'genre', 'popularity']  
  };

  const artiestenList = new List('account-opgeslagen-artiest-grid', options);

  // Zoekfunctie
  const searchInput = document.querySelector('#search');
  searchInput.addEventListener('input', function () {
    artiestenList.search(searchInput.value);
  });

  // Sorteer op naam A-Z
  const sortButtonAZ = document.querySelector('.sort');
  sortButtonAZ.addEventListener('click', () => {
    artiestenList.sort('name', { order: "asc" });
  });

  // Sorteer op naam Z-A
  const sortButtonZA = document.querySelector('.sort-low');
  sortButtonZA.addEventListener('click', () => {
    artiestenList.sort('name', { order: "desc" });
  });

  // Sorteer op populariteit laag → hoog
  const sortLowButton = document.querySelector('.sort-popularity');
  sortLowButton.addEventListener('click', () => {
    artiestenList.sort('popularity', {
      order: "ssc",
      sortFunction: function (a, b) {
        // Zorg ervoor dat de populariteit als een numerieke waarde wordt behandeld
        const popA = parseInt(a.values().popularity) || 0;
        const popB = parseInt(b.values().popularity) || 0;
        return popA - popB;
      }
    });
  });
});
