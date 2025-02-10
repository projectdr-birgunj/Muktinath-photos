async function uploadFiles() {
  const fileInput = document.getElementById("fileInput");
  const statusContainer = document.getElementById("statusContainer");
  statusContainer.innerHTML = ""; // Clear previous status

  if (!fileInput.files.length) {
    statusContainer.innerHTML = "<p>Please select files!</p>";
    return;
  }

  const files = Array.from(fileInput.files);

  for (const file of files) {
    const fileStatus = document.createElement("div");
    fileStatus.innerHTML = `<p>${file.name}: <span class="progress">0%</span></p>`;
    statusContainer.appendChild(fileStatus);

    const reader = new FileReader();
    reader.onload = async function (event) {
      let base64Content = event.target.result.split(",")[1];

      const payload = {
        fileName: file.name,
        fileContent: base64Content,
      };

      try {
        const response = await fetch("https://baskets-fe-italiano-ict.trycloudflare.com/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
          fileStatus.innerHTML = `<p>${file.name}: ✅ Uploaded!</p>`;
        } else {
          fileStatus.innerHTML = `<p>${file.name}: ❌ Upload failed!</p>`;
        }
      } catch (error) {
        fileStatus.innerHTML = `<p>${file.name}: ❌ Error connecting to server!</p>`;
      }
    };

    reader.readAsDataURL(file);
  }
}
