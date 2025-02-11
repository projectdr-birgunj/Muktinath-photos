async function uploadFiles() {
  const fileInput = document.getElementById("fileInput");
  const statusContainer = document.getElementById("statusContainer");
  statusContainer.innerHTML = ""; // Clear previous statuses

  if (!fileInput.files.length) {
    statusContainer.innerHTML = "<p>Please select files!</p>";
    return;
  }

  const files = Array.from(fileInput.files);
  const fileData = [];
  const fileProgressBars = {};

  // Create UI feedback for each file
  files.forEach((file) => {
    const fileStatusDiv = document.createElement("div");
    fileStatusDiv.className = "file-status";
    fileStatusDiv.innerHTML = `
        <span>${file.name} - Uploading...</span>
        <div class="progress-bar-container">
          <div class="progress-bar" id="progress-${file.name}"></div>
        </div>
      `;
    statusContainer.appendChild(fileStatusDiv);
    fileProgressBars[file.name] = fileStatusDiv.querySelector(".progress-bar");
  });

  // Read files as Base64
  for (const file of files) {
    const reader = new FileReader();
    const filePromise = new Promise((resolve) => {
      reader.onload = function (event) {
        fileData.push({
          fileName: file.name,
          fileContent: event.target.result.split(",")[1], // Remove base64 prefix
        });
        resolve();
      };
    });

    reader.readAsDataURL(file);
    await filePromise;
  }

  // Upload files with progress simulation
  try {
    const response = await fetch(
      "https://phase-optics-shirt-owen.trycloudflare.com/upload",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: fileData }),
      }
    );

    const result = await response.json();

    result.results.forEach((fileResult) => {
      const progressBar = fileProgressBars[fileResult.fileName];
      if (progressBar) {
        progressBar.style.width = "100%"; // Full progress bar
        progressBar.style.backgroundColor = fileResult.success
          ? "#4caf50"
          : "#ff0000"; // Green or Red
        progressBar.parentElement.previousElementSibling.innerText =
          fileResult.success
            ? `${fileResult.fileName} - ✅ Uploaded!`
            : `${fileResult.fileName} - ❌ Failed!`;
      }
    });
  } catch (error) {
    statusContainer.innerHTML = "<p>❌ Error connecting to server!</p>";
  }
}
