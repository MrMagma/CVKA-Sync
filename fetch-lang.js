var get_tree = require("./get-tree.js");
var fs = require("fs");

function add_slug_map(topicTree) {
    var slugMap = {};
    
    for (var i = 0; i < topicTree.children.length; ++i) {
        slugMap[topicTree.children[i]] = i;
    }
    
    topicTree.slug_map = slugMap;
}

function get_lang_tree() {
    var lang = process.argv[2];
    get_tree(lang, "root", function(tree) {
        add_slug_map(tree);
        fs.writeFile("./output/" + lang + "-tree.json", JSON.stringify(tree), function() {
            
        });
    });
}

get_lang_tree();
