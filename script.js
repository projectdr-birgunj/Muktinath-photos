async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    status.innerText = "Please select a file!";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    let base64Content = event.target.result.split(",")[1]; // Remove prefix

    const payload = {
      fileName: file.name,
      fileContent: base64Content,
    };

    try {
      const response = await fetch("http://103.175.180.62:3000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      status.innerText = result.success
        ? `✅ ${file.name} uploaded!`
        : `❌ Upload failed!`;
    } catch (error) {
      status.innerText = "❌ Error connecting to server!";
    }
  };

  reader.readAsDataURL(file);
}
