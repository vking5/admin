let imageList = [];

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
    alert("No images to download. Generate album first.");
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
