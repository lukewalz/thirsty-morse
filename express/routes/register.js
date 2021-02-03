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
    subscription = req.body
    res.sendStatus(201)
    pushIntervalID = setInterval(() => {
        // sendNotification can only take a string as it's second parameter
        webpush.sendNotification(subscription, JSON.stringify(testData))
            .catch((er) => { clearInterval(pushIntervalID); throw Error(er) })
    }, 30000)
})

router.delete("/unregister", (req, res, next) => {
    subscription = null
    clearInterval(pushIntervalID)
    res.sendStatus(200)
})

module.exports = router
