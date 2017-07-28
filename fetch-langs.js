var get_tree = require("./get-tree.js");
var langs = require("./languages.json").languages;
var fs = require("fs");

function add_slug_map(topicTree) {
    var slugMap = {};
    
    for (var i = 0; i < topicTree.children.length; ++i) {
        slugMap[topicTree.children[i]] = i;
    }
    
    topicTree.slug_map = slugMap;
}

function get_lang_tree() {
    var lang = langs.shift();
    get_tree(lang, "root", function(tree) {
        add_slug_map(tree);
        fs.writeFile("./output/" + lang + "-tree.json", JSON.stringify(tree), function() {
            
        });
        get_lang_tree();
    });
}

get_lang_tree();
