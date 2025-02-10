const GITHUB_USERNAME = "projectdr-birgunj"; // Replace with your GitHub username
const REPO_NAME = "Muktinath-photos"; // Replace with your repository name
const BRANCH = "main"; // Change if using a different branch
const ACCESS_TOKEN = "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"; // ⚠️ Store this securely in a backend!

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
        const content = btoa(event.target.result); // Convert file to Base64

        const path = `uploads/${file.name}`; // Change path as needed

        // GitHub API endpoint to create or update files
        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${path}`;

        // Check if file exists
        let sha = null;
        try {
            const response = await fetch(url, { headers: { Authorization: `token ${ACCESS_TOKEN}` } });
            if (response.ok) {
                const data = await response.json();
                sha = data.sha; // Get the SHA to update file
            }
        } catch (error) {
            console.log("File does not exist, creating a new one.");
        }

        const data = {
            message: `Uploaded ${file.name}`,
            content: content,
            branch: BRANCH,
        };
        if (sha) data.sha = sha; // Needed for updating files

        // Upload file
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `token ${ACCESS_TOKEN}`,
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

    reader.readAsBinaryString(file);
}
