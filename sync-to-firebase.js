var firebase = require("firebase");
var secrets = require("./secrets.json");

var argv = process.argv,
    argc = argv.length;

function syncToFirebase(topicTree) {
    firebase.initializeApp({
        serviceAccount: "credentials.json",
        databaseURL: "https://ka-clarifs-70838.firebaseio.com"
    });
    var token = firebase.auth().createCustomToken("cvka-topic-tree-sync-bot");
    var db = firebase.database();
    var ref = db.ref("content_tree");
    ref.set(topicTree)
        .then(function() {
            console.log("Synced.");
            process.exit(0);
        })
        .catch(function(error) {
            console.log("Sync failed.");
            console.error(error);
            process.exit(1);
        });
}

if (argc < 3) {
    console.log("Please provide a file to sync");
} else {
    console.log("Syncing...");
    syncToFirebase(require("./" + argv[2]));
}
