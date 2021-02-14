
const vapidPublicKey = 'BGuyWcyfyg50-ixydbkI2AEeFDFJvHhN-5xD4c1bGz5zWySLs1Zh8d3HZPoAxnSyWkAKn-erIqSN-5l1a6jZbTQ'
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default async function subscribePush() {
    console.log('subscribe spushhh')
    var data = navigator.serviceWorker.ready.then(registration => {
        if (!registration.pushManager) {
            alert("Push Unsupported")
            return
        };
        registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            })
            .then(token => {
                console.log(token)
                return token;
            })
            .catch(err => console.error("Push subscription error: ", err))
    })

    return data;
}