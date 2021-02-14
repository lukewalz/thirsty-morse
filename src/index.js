import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from "react-dom";
import App from "./App";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


function isPushNotificationSupported() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('Service Worker Registered!')
                })
                .catch(err => {
                    console.log('Service Worker Registration Failed', err)
                })
        })
    }
}

async function askUserPermission() {
    return await Notification.requestPermission();
}

askUserPermission();
isPushNotificationSupported();

Sentry.init({
    dsn: "https://42a79955943a43b5bfac3e08782eae65@o247578.ingest.sentry.io/5615152",
    integrations: [
        new Integrations.BrowserTracing(),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
