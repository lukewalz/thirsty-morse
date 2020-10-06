import { handleResponse, handleError } from "./apiUtils";

export async function getGames() {
    var data = await getFileFromStorage();
    if (data !== undefined) {
        console.log('getting from storage');
        return await handleResponse(data)
    }
    else {
        console.log('getting from api');
        var e = await handleError();
        return e;
    }
}

export async function getFileFromStorage() {
    try {
        var path = "https://walzstorage.blob.core.windows.net/lspn/file.json?sv=2019-10-10&st=2020-10-06T20%3A32%3A19Z&se=2021-04-16T20%3A32%3A00Z&sr=b&sp=raw&sig=zVzh%2FqQIpl5XqpPx6Y4mbr%2Bh5sqL6HlN3LuHTN9sXUQ%3D"
        var response = await fetch(
            path,
            {
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }
        ).then(e => e.json());

        return response;
    }
    catch {
        return undefined;
    }

}

