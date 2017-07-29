var request = require("request");

var url = "https://cdn.kastatic.org/genfiles/javascript/en/shared-styles-package-857abe.js";

module.exports = function getColors(cb) {
    request(url, function(error, response, body) {
        var a = body.match(/[a-zA-z]+Domain1\:\"#.+?\"/g).map(function(match) {
            var out = match.split(":");
            return [
                out[0].substring(0, out[0].length - ("Domain1".length)).replace(/([A-Z])/g, "-$&").toLowerCase()
                    .replace(/^cs$/g, "computing").replace(/^economics$/g, "economics-finance-domain"),
                out[1].substring(1, out[1].length - 1)
            ];
        });
        
        var colors = {};
        
        for (var i = 0; i < a.length; i++) {
            colors[a[i][0]] = a[i][1];
        }
        
        cb(colors);
    });
};
