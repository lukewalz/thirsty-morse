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
    pushIntervalID = setInterval(() => {
        console.log('atleastr this')
        // sendNotification can only take a string as it's second parameter
        webpush.sendNotification(subscription, JSON.stringify(testData)).then(resp => { console.log(resp); res.sendStatus(201).send(webpush.generateVAPIDKeys().config.data) })
            .catch((er) => { throw Error(er) })
    }, 10000);
})

router.delete("/unregister", (req, res, next) => {
    subscription = null
    clearInterval(pushIntervalID)
    res.sendStatus(200)
})

module.exports = router
