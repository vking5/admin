let imageList = [];
let step = 0;

async function handleCloneProcess() {
  const cloneBtn = document.getElementById("cloneBtn");
  const textarea = document.getElementById("orderText");
  const separator = document.getElementById("separator");
  const albumDiv = document.getElementById("album");

  if (step === 0) {
    try {
      const text = await navigator.clipboard.readText();
      textarea.value = text;
    } catch (err) {
      alert("Unable to access clipboard. Please paste manually.");
    }

    textarea.classList.remove("hidden");
    separator.classList.remove("hidden");

    cloneBtn.innerText = "Clone Bill";  
    step = 1;
  } else if (step === 1) {
    generateAlbum();
    albumDiv.classList.remove("hidden");
  }
}

function generateAlbum() {
  const text = document.getElementById("orderText").value;
  const albumDiv = document.getElementById("album");

  albumDiv.innerHTML = "";
  imageList = [];

  const pattern = /\d+\.\s*([A-Za-z0-9-]+)\s+(https?:\/\/[^\s]+)/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const title = match[1];
    const imageUrl = match[2];
    imageList.push({ title, imageUrl });

    const card = `
      <div class="col-md-4 col-lg-3">
        <div class="card p-2 shadow-sm">
          <img src="${imageUrl}" alt="${title}">
          <h6 class="card-title mt-2">${title}</h6>
          <a href="${imageUrl}" download="${title}.jpg" class="btn btn-outline-light btn-download">Download</a>
        </div>
      </div>
    `;
    albumDiv.innerHTML += card;
  }

  if (albumDiv.innerHTML === "") {
    albumDiv.innerHTML = "<p class='text-center text-danger fw-bold'>No valid image links found.</p>";
  }
}

async function downloadAllImages() {
  if (imageList.length === 0) {
    alert("No images to download. Clone bill first.");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder("order-images");

  const downloads = imageList.map(async (item) => {
    const response = await fetch(item.imageUrl);
    const blob = await response.blob();
    folder.file(`${item.title}.jpg`, blob);
  });

  await Promise.all(downloads);

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "Order-Images.zip");
  });
}
