let accessToken;

function authenticate() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        document.getElementById('listFilesButton').style.display = 'inline-block';
        document.getElementById('uploadButton').style.display = 'inline-block';
    })
    .catch(error => {
        displayError(`Authentication failed: ${error.message}`);
    });
}

function listFiles() {
    fetch(`https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent("YOUR_GOOGLE_DRIVE_FOLDER_ID")}' in parents`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        data.files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            fileList.appendChild(listItem);
        });
    })
    .catch(error => {
        displayError(`Failed to list files: ${error.message}`);
    });
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<p>${message}</p>`;
}

document.getElementById('openFolderButton').addEventListener('click', function() {
    document.getElementById('googleDriveFolder').style.display = 'block';
});

document.getElementById('authenticateButton').addEventListener('click', authenticate);
document.getElementById('listFilesButton').addEventListener('click', listFiles);
