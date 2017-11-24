var save_lang_tree = require("./save-lang-tree.js");
var languages = require("./languages.json").languages;
var fs = require("fs");

function do_the_thing() {
    if (languages.length > 0) {
        save_lang_tree(languages.shift(), do_the_thing);
    }
}

do_the_thing();
