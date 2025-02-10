document
  .getElementById("uploadButton")
  .addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {
      status.innerText = "Please select a file!";
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    status.innerText = "Uploading...";

    try {
      const response = await fetch(
        "https://api.github.com/repos/projectdr-birgunj/Muktinath-photos/actions/workflows/upload.yml/dispatches",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer YOUR_PUBLIC_GITHUB_TOKEN`, // Create a token with 'public_repo' scope
            Accept: "application/vnd.github.everest-preview+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              filename: file.name,
              content: await file.text(), // Read file content
            },
          }),
        }
      );

      if (response.ok) {
        status.innerText = `✅ ${file.name} uploaded successfully!`;
      } else {
        const error = await response.json();
        console.log(error);
        status.innerText = `❌ Upload failed: ${error.message}`;
      }
    } catch (err) {
      console.log(err);
      status.innerText = "❌ Upload failed!";
    }
  });
