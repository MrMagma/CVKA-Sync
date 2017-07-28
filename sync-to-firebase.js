var firebase = require("firebase");
var secrets = require("./secrets.json");
var langs = require("./languages.json").languages;

firebase.initializeApp({
    serviceAccount: "credentials.json",
    databaseURL: "https://ka-clarifs-70838.firebaseio.com"
});

function addSlugMap(topicTree) {
    var slugMap = {};
    
    for (var i = 0; i < topicTree.children.length; ++i) {
        slugMap[topicTree.children[i].slug] = i;
    }
    
    topicTree.slug_map = slugMap;
}

function syncToFirebase(lang, topicTree) {
    addSlugMap(topicTree);
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


for (var i = 0; i < langs.length; ++i) {
    console.log("Syncing " + langs[i] + " tree...");
    syncToFirebase(langs[i], require("./output/" + langs[i] + "-tree.json"));
}
