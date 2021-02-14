const router = require("express").Router()
const webpush = require("web-push")

webpush.setGCMAPIKey(process.env.GOOGLE_API_KEY)
webpush.setVapidDetails(
    "mailto:lukewalz1@gmail.com",
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
)

const testData = {
    title: "Testing",
    body: "It's a success!",
    icon: "/path/to/an/icon.png"
}

let subscription
let pushIntervalID


router.post("/register", (req, res, next) => {
    subscription = req.body;
    console.log(subscription);
    pushIntervalID = setInterval(() => {
        // sendNotification can only take a string as it's second parameter
        webpush.sendNotification(subscription, JSON.stringify(testData)).then(resp => res.sendStatus(201))
            .catch((er) => { clearInterval(pushIntervalID); res.send(er); throw Error(er + ' ' + subscription.endpoint) })
    }, 5000);
})

router.delete("/unregister", (req, res, next) => {
    subscription = null
    clearInterval(pushIntervalID)
    res.sendStatus(200)
})

module.exports = router
