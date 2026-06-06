const API =
"https://advait8370.github.io/Starbound-Stories-Bookstore/books.json";

let books = [];

let favorites =
JSON.parse(
localStorage.getItem("favorites") || "[]"
);

const favCount =
document.getElementById("fav-count");

/* -----------------------------
   Load Books
------------------------------*/

async function loadBooks() {

  try {

    const response =
    await fetch(API, {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(
        "Failed to load books."
      );
    }

    books =
    await response.json();

    renderBooks();
    renderFavorites();

  } catch (err) {

    console.error(err);

    document.getElementById(
      "book-list"
    ).innerHTML =
    `<h2 style="text-align:center;">
      Failed to load books.
    </h2>`;
  }
}

/* -----------------------------
   Favorites
------------------------------*/

function saveFavorites() {

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  favCount.textContent =
  favorites.length;
}

function toggleFavorite(id) {

  if (
    favorites.includes(id)
  ) {

    favorites =
    favorites.filter(
      x => x !== id
    );

  } else {

    favorites.push(id);

  }

  saveFavorites();

  renderBooks();
  renderFavorites();
}

/* -----------------------------
   Render Books
------------------------------*/

function renderBooks() {

  const search =
  document
  .getElementById("search")
  .value
  .toLowerCase();

  let list =
  books.filter(book =>
    book.title
    .toLowerCase()
    .includes(search)
  );

  const sort =
  document
  .getElementById("sort-filter")
  .value;

  if (
    sort === "title-az"
  ) {

    list.sort((a,b)=>
      a.title.localeCompare(
        b.title
      )
    );

  }

  if (
    sort === "title-za"
  ) {

    list.sort((a,b)=>
      b.title.localeCompare(
        a.title
      )
    );

  }

  const grid =
  document.getElementById(
    "book-list"
  );

  grid.innerHTML = "";

  list.forEach(book => {

    const fav =
    favorites.includes(
      book.id
    );

    const card =
    document.createElement(
      "div"
    );

    card.className =
    "book-card";

    card.innerHTML =
    `
    <button
      class="favorite-btn ${fav ? "favorited" : ""}">
      ❤️
    </button>

    <img
      src="${book.cover}"
      alt="${book.title}"
      loading="lazy"
    >

    <h3>
      ${book.title}
    </h3>

    <p>
      ${book.universe}
    </p>

    <div class="card-actions">

      <a
      class="btn free"
      href="reader.html?book=${encodeURIComponent(book.pdf)}&title=${encodeURIComponent(book.title)}">

      📖 Read Book

      </a>

    </div>
    `;

    card
    .querySelector(
      ".favorite-btn"
    )
    .addEventListener(
      "click",
      () => {
        toggleFavorite(
          book.id
        );
      }
    );

    grid.appendChild(
      card
    );

  });

  document
  .getElementById(
    "no-results"
  )
  .hidden =
  list.length !== 0;
}

/* -----------------------------
   Favorites Page
------------------------------*/

function renderFavorites() {

  const grid =
  document.getElementById(
    "favorites-list"
  );

  grid.innerHTML = "";

  const favBooks =
  books.filter(book =>
    favorites.includes(
      book.id
    )
  );

  favBooks.forEach(book => {

    grid.innerHTML +=
    `
    <div class="book-card">

      <img
        src="${book.cover}"
        alt="${book.title}"
      >

      <h3>
        ${book.title}
      </h3>

      <p>
        ${book.universe}
      </p>

      <div class="card-actions">

        <a
        class="btn free"
        href="reader.html?book=${encodeURIComponent(book.pdf)}&title=${encodeURIComponent(book.title)}">

        📖 Read Book

        </a>

      </div>

    </div>
    `;

  });

  document
  .getElementById(
    "no-favorites"
  )
  .hidden =
  favBooks.length !== 0;
}

/* -----------------------------
   Navigation
------------------------------*/

document
.querySelectorAll(
  ".nav-btn"
)
.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      document
      .querySelectorAll(
        ".view"
      )
      .forEach(v => {
        v.hidden = true;
      });

      document
      .getElementById(
        btn.dataset.view
      )
      .hidden = false;

      if (
        btn.dataset.view
        === "favorites"
      ) {
        renderFavorites();
      }

    }
  );

});

/* -----------------------------
   Search + Sort
------------------------------*/

document
.getElementById(
  "search"
)
.addEventListener(
  "input",
  renderBooks
);

document
.getElementById(
  "sort-filter"
)
.addEventListener(
  "change",
  renderBooks
);

/* -----------------------------
   Theme
------------------------------*/

document
.getElementById(
  "theme-toggle"
)
.addEventListener(
  "click",
  () => {

    document
    .documentElement
    .classList
    .toggle(
      "light"
    );

  }
);

/* -----------------------------
   Mobile Menu
------------------------------*/

document
.getElementById(
  "menu-toggle"
)
.addEventListener(
  "click",
  () => {

    const menu =
    document
    .getElementById(
      "mobile-menu"
    );

    menu.hidden =
    !menu.hidden;

  }
);

/* -----------------------------
   Footer
------------------------------*/

document
.getElementById(
  "year"
)
.textContent =
new Date()
.getFullYear();

favCount.textContent =
favorites.length;

/* -----------------------------
   Start App
------------------------------*/

loadBooks();