const urlParams =
new URLSearchParams(
  window.location.search
);

const pdfUrl =
urlParams.get("book");

const title =
urlParams.get("title");

document
.getElementById(
  "book-title"
)
.textContent =
decodeURIComponent(
  title || "Reader"
);

const viewer =
document.getElementById(
  "pdf-viewer"
);

const loader =
document.getElementById(
  "loader"
);

const pageNumEl =
document.getElementById(
  "page-num"
);

const pageCountEl =
document.getElementById(
  "page-count"
);

let pdfDoc = null;

let scale =
parseFloat(
localStorage.getItem(
"readerZoom"
) || "1.3"
);

let currentPage = 1;

let touchStartX = 0;

pdfjsLib
.GlobalWorkerOptions
.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/* ---------------------
   Render Page
---------------------- */

async function renderPage(
pageNumber
){

  if(!pdfDoc)
  return;

  viewer.innerHTML = "";

  const page =
  await pdfDoc.getPage(
    pageNumber
  );

  const viewport =
  page.getViewport({
    scale
  });

  const container =
  document.createElement(
    "div"
  );

  container.className =
  "page-container";

  const canvas =
  document.createElement(
    "canvas"
  );

  const ctx =
  canvas.getContext(
    "2d"
  );

  canvas.width =
  viewport.width;

  canvas.height =
  viewport.height;

  container.appendChild(
    canvas
  );

  viewer.appendChild(
    container
  );

  await page.render({

    canvasContext:
    ctx,

    viewport

  }).promise;

  pageNumEl.textContent =
  pageNumber;

  pageCountEl.textContent =
  pdfDoc.numPages;

  localStorage.setItem(

    "last-page-" +
    pdfUrl,

    pageNumber

  );

}

/* ---------------------
   Load PDF
---------------------- */

async function loadPDF(){

  try{

    pdfDoc =
    await pdfjsLib
    .getDocument(
      pdfUrl
    )
    .promise;

    const savedPage =
    localStorage.getItem(

      "last-page-"
      + pdfUrl

    );

    if(savedPage){

      currentPage =
      parseInt(
        savedPage
      );

    }

    await renderPage(
      currentPage
    );

  }

  catch(err){

    console.error(
      err
    );

    viewer.innerHTML =

    `
    <div style="
    text-align:center;
    padding:100px 20px;
    ">

    <h2>
    Failed to load PDF
    </h2>

    <p>
    ${err}
    </p>

    </div>
    `;

  }

  setTimeout(()=>{

    loader.style.opacity =
    "0";

    setTimeout(()=>{

      loader.style.display =
      "none";

    },800);

  },500);

}

/* ---------------------
   Navigation
---------------------- */

function nextPage(){

  if(

    currentPage <
    pdfDoc.numPages

  ){

    currentPage++;

    renderPage(
      currentPage
    );

  }

}

function prevPage(){

  if(

    currentPage > 1

  ){

    currentPage--;

    renderPage(
      currentPage
    );

  }

}

/* ---------------------
   Buttons
---------------------- */

document
.getElementById(
"next"
)
.onclick =
nextPage;

document
.getElementById(
"prev"
)
.onclick =
prevPage;

document
.getElementById(
"zoom-in"
)
.onclick =
()=>{

scale += 0.15;

localStorage.setItem(

"readerZoom",

scale

);

renderPage(
currentPage
);

};

document
.getElementById(
"zoom-out"
)
.onclick =
()=>{

if(
scale > 0.6
){

scale -= 0.15;

localStorage.setItem(

"readerZoom",

scale

);

renderPage(
currentPage
);

}

};

document
.getElementById(
"fullscreen"
)
.onclick =
()=>{

if(
!document
.fullscreenElement
){

document
.documentElement
.requestFullscreen();

}else{

document
.exitFullscreen();

}

};

/* ---------------------
   Swipe
---------------------- */

document
.addEventListener(

"touchstart",

e=>{

touchStartX =

e.changedTouches[0]
.screenX;

}

);

document
.addEventListener(

"touchend",

e=>{

const touchEndX =

e.changedTouches[0]
.screenX;

if(

touchEndX
<
touchStartX
-
80

){

nextPage();

}

if(

touchEndX
>
touchStartX
+
80

){

prevPage();

}

}

);

/* ---------------------
   Keyboard
---------------------- */

document
.addEventListener(

"keydown",

e=>{

if(
e.key ===
"ArrowRight"
){

nextPage();

}

if(
e.key ===
"ArrowLeft"
){

prevPage();

}

}

);

/* ---------------------
   Starfield
---------------------- */

const starCanvas =
document.getElementById(
"stars"
);

const starCtx =
starCanvas.getContext(
"2d"
);

let w =
starCanvas.width =
window.innerWidth;

let h =
starCanvas.height =
window.innerHeight;

window
.addEventListener(

"resize",

()=>{

w =
starCanvas.width =
window.innerWidth;

h =
starCanvas.height =
window.innerHeight;

}

);

const stars =
Array.from(

{length:120},

()=>({

x:
Math.random()*w,

y:
Math.random()*h,

r:
Math.random()*2,

s:
Math.random()*.6+.2

})

);

function animateStars(){

starCtx.clearRect(
0,
0,
w,
h
);

stars.forEach(

star=>{

star.y +=
star.s;

if(
star.y > h
){

star.y = 0;

star.x =
Math.random()*w;

}

starCtx.beginPath();

starCtx.fillStyle =
"rgba(255,255,255,.8)";

starCtx.arc(

star.x,

star.y,

star.r,

0,

Math.PI*2

);

starCtx.fill();

}

);

requestAnimationFrame(
animateStars
);

}

animateStars();

/* ---------------------
   Start
---------------------- */

loadPDF();