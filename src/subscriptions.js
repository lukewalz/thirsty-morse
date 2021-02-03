
import axios from "axios";

export default function subscribePush() {
    navigator.serviceWorker.ready.then(registration => {
        if (!registration.pushManager) {
            alert("Push Unsupported")
            return
        }

        return registration.pushManager.getSubscription().then(y => {
            console.log(y);
            registration.pushManager
                .subscribe(y.options)
                .then(subscription => axios.post("http://localhost:9000/.netlify/functions/server/notifications/register", subscription))
                .catch(err => console.error("Push subscription error: ", err))
        })

    })
}