export async function handleResponse(response) {
    var t = await response.json();
    return t;
}

export async function handleError(error) {
    console.log(error)
}
