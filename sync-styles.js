var request = require("request");
var firebase = require("firebase");
var secrets = require("./secrets.json");
var langs = require("./languages.json").languages;

firebase.initializeApp({
    serviceAccount: "credentials.json",
    databaseURL: "https://ka-clarifs-70838.firebaseio.com"
});

var url = "https://cdn.kastatic.org/genfiles/javascript/en/shared-styles-package-857abe.js";

request(url, function(error, response, body) {
    var a = body.match(/[a-zA-z]+Domain1\:\"#.+?\"/g).map(function(match) {
        var out = match.split(":");
        return [
            out[0].substring(0, out[0].length - ("Domain1".length)).replace(/([A-Z])/g, "-$&").toLowerCase(),
            out[1].substring(1, out[1].length - 1)
        ];
    });
    
    var colors = {};
    
    for (var i = 0; i < a.length; i++) {
        colors[a[i][0]] = a[i][1];
    }
    
    var token = firebase.auth().createCustomToken("cvka-topic-tree-sync-bot");
    var db = firebase.database();
    var ref = db.ref("data/colors");
    ref.set(colors);
});
