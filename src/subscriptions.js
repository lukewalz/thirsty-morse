
import axios from "axios";
import { addSubscription } from './api/lspnApi'


const path = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/.netlify/functions/server/notifications/register' : '/.netlify/functions/server/notifications/register'

const vapidPublicKey = 'BGuyWcyfyg50-ixydbkI2AEeFDFJvHhN-5xD4c1bGz5zWySLs1Zh8d3HZPoAxnSyWkAKn-erIqSN-5l1a6jZbTQ'
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default async function subscribePush() {
    navigator.serviceWorker.register("/sw.js");
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
            .then(subscription => { addSubscription(subscription); return axios.post(path, subscription) }).then(r => JSON.parse(r.config.data))
            .catch(err => console.error("Push subscription error: ", err))
    })

    return data;
}