import { handleResponse, handleError } from "./apiUtils";

export async function getGames() {
    var data = getFileFromStorage()
        .then(handleResponse)
        .catch(handleError);

    if (data !== undefined) {
        return data;
    }

}

export async function getFileFromStorage(file) {
    try {
        var path = "https://walzstorage.blob.core.windows.net/lspn/file.json?sv=2019-10-10&st=2020-10-03T02%3A33%3A53Z&se=2020-10-04T02%3A33%3A53Z&sr=b&sp=rw&sig=%2FbNcI0TdxmXbQPyfe14qNwHxH%2FZ5Jh2lZIE0uxpNRKo%3D"
        return fetch(
            path,
            {
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }
        )
    }
    catch {
        return undefined;
    }

}

