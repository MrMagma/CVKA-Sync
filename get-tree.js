var request = require("request");
var colors = require("colors");

var API_PATH = "https://{{lang}}.khanacademy.org";
var TOPIC_SLUG = "/api/v1/topic/";
var VIDEO_SLUG = "/api/v1/videos/";

var reqQueue = [];
var curReqs = 0;
var maxReqs = 50;
var start = Date.now();

function get_data(url, cb) {
    if (curReqs < maxReqs) {
        curReqs += 1;
        console.log(("[" + (Date.now() - start) + "ms] Requesting " + url).grey);
        
        request(url, function(error, response, body) {
            curReqs -= 1;
            
            if (error) {
                console.log(("[" + (Date.now() - start) + "ms] Error: " + error.toString()).red);
                reqQueue.push([url, cb]);
            } else {
                var data;
                try {
                    data = JSON.parse(body);
                    cb(data);
                } catch (err) {
                    reqQueue.push([url, cb]);
                }
            }
            
            console.log(curReqs, reqQueue.length);
        });
    } else {
        reqQueue.push([url, cb]);
    }
}

function get_subtopics(lang, topic, cb) {
    var children = [];
    var queue = 0;
    
    for (var i = 0; i < topic.children.length; ++i) {
        if (topic.children[i].kind === "Topic") {
            (function(topic) {
                queue += 1;
                get_topic(lang, topic, function(data) {
                    children.push(data);
                    queue -= 1;
                    if (queue === 0) {
                        cb(children);
                    }
                });
            })(topic.children[i].node_slug);
        }
    }
    
    if (queue === 0) {
        cb(children);
    }
}

function get_topic(lang, slug, cb) {
    var lstart = Date.now();
    console.log(("[" + (Date.now() - start) + "ms] Fetching topic " + slug).cyan);
    get_data(API_PATH.replace("{{lang}}", lang) + TOPIC_SLUG + slug, function(topic) {
        console.log(("[" + (Date.now() - start) + "ms] Successfully fetched topic " + slug).green);
        var output = {
            "slug": topic.node_slug,
            "relative_url": topic.relative_url,
            "title": topic.title,
            "children": null,
            "video_slug_map": null
        };
        var queue = 2;
        
        get_subtopics(lang, topic, function(children) {
            output.children = children;
            queue -= 1;
            
            if (queue <= 0) {
                cb(output);
                console.log(("[" + (Date.now() - start) + "ms] Completed fetching " + slug + " in " + Math.floor((Date.now() - lstart) / 1000) + " seconds").cyan);
            }
        });
        
        get_vid_slug_map(lang, topic, function(slug_map) {
            output.video_slug_map = slug_map;
            queue -= 1;
            
            if (queue <= 0) {
                cb(output);
                console.log(("[" + (Date.now() - start) + "ms] Completed fetching " + slug + " in " + Math.floor((Date.now() - lstart) / 1000) + " seconds").cyan);
            }
        });
    });
}

function get_vid_slug(lang, internal_id, cb) {
    console.log(("[" + (Date.now() - start) + "ms] Getting video slug for " + internal_id).cyan);
    get_data(API_PATH.replace("{{lang}}", lang) + VIDEO_SLUG + internal_id, function(data) {
        console.log(("[" + (Date.now() - start) + "ms] Successfully retrieved video slug for " + internal_id).green);
        cb(data.youtube_id);
    });
}

function get_vid_slug_map(lang, topic, cb) {
    var slug_map = {};
    var queue = 0;
    
    for (var i = 0; i < topic.children.length; ++i) {
        if (topic.children[i].kind === "Video") {
            (function(id) {
                queue += 1;
                get_vid_slug(lang, id, function(vid_id) {
                    slug_map[id] = vid_id;
                    queue -= 1;
                    if (queue === 0 && i === topic.children.length) {
                        cb(slug_map);
                    }
                });
            })(topic.children[i].id);
        }
    }
    
    if (queue === 0) {
        cb(slug_map);
    }
    
    return slug_map;
}

setInterval(function() {
    while (curReqs < maxReqs && reqQueue.length) {
        get_data.apply(get_data, reqQueue.shift());
    }
}, 1000);

module.exports = get_topic;
