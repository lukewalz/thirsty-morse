export async function handleResponse(response) {
    if (response.success) {
        var jsonResponse = await response;
        console.log(jsonResponse);
        return jsonResponse;
    }
    else {
        console.log(response);
    }
}

export async function addFileToStorage() {
    var apiPath = 'https://api.the-odds-api.com/v3/odds/?apiKey=258c9effb7728eaadb640b09e19af71b&sport=americanfootball_ncaaf&region=us&mkt=spreads'
    var file = await fetch(apiPath, {
        method: "GET"
    });
    var fileResults = await file.json().then(e => { return e });

    var jsonse = JSON.stringify(fileResults);
    var blob = new Blob([jsonse], { type: "application/json" });
    var path = "https://walzstorage.blob.core.windows.net/lspn/file.json?sv=2019-10-10&st=2020-10-06T20%3A32%3A19Z&se=2021-04-16T20%3A32%3A00Z&sr=b&sp=raw&sig=zVzh%2FqQIpl5XqpPx6Y4mbr%2Bh5sqL6HlN3LuHTN9sXUQ%3D"
    fetch(
        path,
        {
            headers: {
                "x-ms-blob-type": "BlockBlob",
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: blob
        }
    );
    return fileResults;
}

export async function handleError() {
    return await addFileToStorage();
}
