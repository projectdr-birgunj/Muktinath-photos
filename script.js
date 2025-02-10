const GITHUB_USERNAME = "projectdr-birgunj"; // Replace with your GitHub username
const REPO_NAME = "Muktinath-photos"; // Replace with your repository name
const BRANCH = "main"; // Change if using a different branch

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
    let base64Content = event.target.result;

    // Remove the "data:image/png;base64," (or similar) prefix
    base64Content = base64Content.split(",")[1];

    const path = `uploads/${file.name}`;
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${path}`;

    // Check if file exists in the repo
    let sha = null;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (response.ok) {
        const data = await response.json();
        sha = data.sha; // Needed for updating an existing file
      }
    } catch (error) {
      console.log("File does not exist, creating a new one.");
    }

    // Prepare data payload
    const data = {
      message: `Uploaded ${file.name}`,
      content: base64Content,
      branch: BRANCH,
    };
    if (sha) data.sha = sha; // Add SHA if updating an existing file

    // Upload file
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      status.innerText = `✅ ${file.name} uploaded successfully!`;
    } else {
      status.innerText = `❌ Upload failed!`;
    }
  };

  reader.readAsDataURL(file); // Read file as Base64
}
