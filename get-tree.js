var request = require("request");

function trim_tree(tree) {
    let trimmed = {
        relative_url: tree.relative_url,
        slug: tree.node_slug,
        title: tree.title,
        children: []
    };
    
    if (tree.children.length > 0) {
        if (tree.children[0].kind === "Topic") {
            trimmed.children = tree.children.map(trim_tree);
        } else {
            trimmed.video_slug_map = {};
            for (var i = 0; i < tree.children.length; ++i) {
                trimmed.video_slug_map[tree.children[i].slug] = tree.children[i].translated_youtube_id;
            }
        }
    }
    
    return trimmed;
}

module.exports = function(lang, cb) {
    console.log(`Fetching ${lang} tree`);
    request("https://" + lang + ".khanacademy.org/api/v1/topictree", function(error, response, body) {
        console.log(`Got ${lang} tree`);
        try {
            cb(trim_tree(JSON.parse(body)));
        } catch {
            console.log(`An error was encountered while saving the ${lang} tree`);
        }
    });
}
