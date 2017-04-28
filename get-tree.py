import json
import sys
import time
import urllib.request

argv = sys.argv
argc = len(argv)

API_PATH = "https://www.khanacademy.org"
TOPIC_SLUG = "/api/v1/topic/"
VIDEO_SLUG = "/api/v1/videos/"

def get_vid_slug(internal_id):
    print("Fetching video:", internal_id)
    request = urllib.request.Request(API_PATH + VIDEO_SLUG + internal_id)
    with urllib.request.urlopen(request) as response:
        video = json.loads(response.readall().decode("utf-8"))
    
    return video["youtube_id"]

def get_vid_slug_map(topic):
    slug_map = {}
    
    for child in topic["children"]:
        if (child["kind"] == "Video"):
            slug_map[child["id"]] = get_vid_slug(child["id"])
    
    return slug_map

def get_subtopics(topic):
    children = []
    
    for child in topic["children"]:
        if (child["kind"] == "Topic"):
            children.append(get_topic(child["node_slug"]))
    
    return children        

def get_topic(slug):
    print("Fetching topic:", slug)
    request = urllib.request.Request(API_PATH + TOPIC_SLUG + slug)
    with urllib.request.urlopen(request) as response:
        topic = json.loads(response.readall().decode("utf-8"))
    
    return {
        "slug": topic["node_slug"],
        "relative_url": topic["relative_url"],
        "title": topic["title"],
        "children": get_subtopics(topic),
        "video_slug_map": get_vid_slug_map(topic)
    }

if argc < 2:
    print("Please specify an output file.")
else:
    out = open(argv[1], "w")
    tree = get_topic("root")
    tree["last_updated"] = time.strftime("%x%X")
    out.write(json.dumps(tree))
    out.close(