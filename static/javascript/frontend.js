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

// Drag and drop logicadocument.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('DOMContentLoaded', () => {
  const lijst = document.querySelector('#draggable-list')
  if (!lijst) return

  let gesleept = null

  function voegDragEventsToe() {
    lijst.querySelectorAll('.grid-item').forEach(item => {
      item.setAttribute('draggable', true)

      item.addEventListener('dragstart', () => {
        gesleept = item
        item.classList.add('dragElem')
      })

      item.addEventListener('dragover', e => {
        e.preventDefault()
        item.classList.add('over')
      })

      item.addEventListener('dragleave', () => {
        item.classList.remove('over')
      })

      item.addEventListener('drop', e => {
        e.preventDefault()
        item.classList.remove('over')

        if (gesleept && gesleept !== item) {
          const bounding = item.getBoundingClientRect()
          const offset = e.clientY - bounding.top

          if (offset > bounding.height / 2) {
            lijst.insertBefore(gesleept, item.nextSibling)
          } else {
            lijst.insertBefore(gesleept, item)
          }

          slaNieuweVolgordeOp()
        }
      })

      item.addEventListener('dragend', () => {
        item.classList.remove('dragElem')
        lijst.querySelectorAll('.grid-item').forEach(i => i.classList.remove('over'))
      })
    })
  }

  function slaNieuweVolgordeOp() {
    const ids = Array.from(lijst.querySelectorAll('.grid-item'))
      .map(item => item.dataset.id)

    fetch('/opgeslagen-artiesten/volgorde', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nieuweVolgorde: ids })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) console.warn('Niet opgeslagen')
    })
    .catch(err => {
      console.error('Fout bij opslaan:', err)
    })
  }

  voegDragEventsToe()
})

