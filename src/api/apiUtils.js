
export async function handleResponse(response) {
    if (response.ok) {
        var jsonResponse = await response.json().then(e => e);
        return jsonResponse;
    }
    else {
        console.log(404);
        var path = 'https://api.the-odds-api.com/v3/odds/?apiKey=258c9effb7728eaadb640b09e19af71b&sport=americanfootball_ncaaf&region=us&mkt=spreads'
        var file = await fetch(path, {
            method: "GET"
        });
        file = new File([file.data], "data.json", { type: "application/json" });
        addFileToStorage(file);
    }
}

export async function addFileToStorage(file) {
    var path = "https://walzstorage.blob.core.windows.net/lspn/file.json?sv=2019-10-10&st=2020-10-02T22%3A27%3A37Z&se=2020-10-03T22%3A27%3A37Z&sr=c&sp=racl&sig=Lo%2F3MhGYi0nJG1a51gmzPaIfraafmTXtYd73cLubFuc%3D"
    return fetch(
        path,
        {
            headers: {
                "x-ms-blob-type": "BlockBlob",
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: file
        }
    );
}

export async function handleError(error) {
    console.log(error);
}
