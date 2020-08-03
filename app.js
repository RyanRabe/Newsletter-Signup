const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;

    //Creating data as JS object
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: { //What MailChimp uses as Merge fields for their DB
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    //Converting data to JSON format to send to MailChimp API
    var jsonData = JSON.stringify(data);

    //API Endpoint PLUS my unique list ID appended to the end
    const url = "https://us17.api.mailchimp.com/3.0/lists/9cdc645778";

    //What to use as options is gotten from the https module documentation
    const options = {
        method: "POST",
        auth: "ryan1:0d8e30f51b20af71357a21643e06cec3-us17"
    };

    //We must first save our request as a constant and then write it.
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));

        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

//Notes in book
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000.");
});

//MailChimp API key
//0d8e30f51b20af71357a21643e06cec3-us17
//List ID
//9cdc645778
