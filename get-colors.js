var request = require("request");

// Khan Academy changed where the colors are at some point and I'm too lazy to find them right now so we're just not syncing them for now
module.exports = function getColors(cb) {
    // request("https://www.khanacademy.org", function(error, response, body) {
    //     var url = body.match(/https:\/\/cdn\.kastatic\.org\/genfiles\/javascript\/en\/shared-styles-package-[a-z0-9]+\.js/gi)[0];
    //     request(url, function(error, response, body) {
    //         var a = body.match(/[a-zA-z]+Domain1\:\"#.+?\"/g).map(function(match) {
    //             var out = match.split(":");
    //             return [
    //                 out[0].substring(0, out[0].length - ("Domain1".length)).replace(/([A-Z])/g, "-$&").toLowerCase()
    //                     .replace(/^cs$/g, "computing").replace(/^economics$/g, "economics-finance-domain"),
    //                 out[1].substring(1, out[1].length - 1)
    //             ];
    //         });
            
    //         var colors = {};
            
    //         for (var i = 0; i < a.length; i++) {
    //             colors[a[i][0]] = a[i][1];
    //         }
            
    //         cb(colors);
    //     });
    // });

    request("https://ka-clarifs-70838.firebaseio.com/data/colors.json", function(error, response, body) {
        cb(JSON.parse(body));
    })
};
