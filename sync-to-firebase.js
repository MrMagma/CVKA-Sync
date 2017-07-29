var firebase = require("firebase");
var secrets = require("./secrets.json");
var langs = require("./languages.json").languages;
var getColors = require("./get-colors.js");

var colors;

firebase.initializeApp({
    serviceAccount: "credentials.json",
    databaseURL: "https://ka-clarifs-70838.firebaseio.com"
});

function addSlugData(topicTree, colors) {
    var slugData = {};
    
    for (var i = 0; i < topicTree.children.length; ++i) {
        slugData[topicTree.children[i].slug] = {
            child_index: i,
            title: topicTree.children[i].title,
            color: colors[topicTree.children[i].slug] || colors.default
        };
    }
    
    topicTree.slug_data = slugData;
}

function syncToFirebase(lang, topicTree) {
    addSlugData(topicTree, colors);
    var token = firebase.auth().createCustomToken("cvka-topic-tree-sync-bot");
    var db = firebase.database();
    var ref = db.ref("content_trees/" + lang);
    ref.set(topicTree)
        .then(function() {
            console.log("Synced " + lang);
            process.exit(0);
        })
        .catch(function(error) {
            console.log(lang + " sync failed");
            console.error(error);
            process.exit(1);
        });
}


getColors(function(c) {
    colors = c;
    for (var i = 0; i < langs.length; ++i) {
        console.log("Syncing " + langs[i] + " tree...");
        syncToFirebase(langs[i], require("./output/" + langs[i] + "-tree.json"));
    }
});
