var get_tree = require("./get-tree.js");
var fs = require("fs");

function add_slug_map(topicTree) {
    var slugMap = {};
    
    for (var i = 0; i < topicTree.children.length; ++i) {
        slugMap[topicTree.children[i].domain_slug] = i;
    }
    
    topicTree.slug_map = slugMap;
}

function save_lang_tree(lang, cb) {
    get_tree(lang, function(tree) {
        add_slug_map(tree);
        fs.writeFile("./output/" + lang + "-tree.json", JSON.stringify(tree), function() {
            cb();
        });
    });
}

module.exports = save_lang_tree;
