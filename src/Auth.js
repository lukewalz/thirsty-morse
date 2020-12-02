import React from "react";
import MongoClient from 'mongodb';

function Auth() {


    var uri = "mongodb+srv://luke_walz:EzOOtwCRzgmjpXxe@cluster0.3x57e.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
    var client = new MongoClient(uri, { useNewUrlParser: true });
    console.log(client);
    client.connect(err => {
        const collection = client.db("test").collection("devices");
        // perform actions on the collection object
        client.close();
    });


    return 'Hello';
}

export default Auth;


