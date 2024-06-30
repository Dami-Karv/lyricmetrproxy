import sys
import json
import lyricsgenius

GENIUS_ACCESS_TOKEN = 'bvo-JN81MSCiz4axQKZVhcBPFTwNiYXrmqXAr2A0_Et_wbtfPe4kU4h2wYO5hQ7o'

def fetch_album_details(album_id):
    genius = lyricsgenius.Genius(GENIUS_ACCESS_TOKEN, timeout=10, sleep_time=1.0)
    album = genius.album(album_id)
    return album

if __name__ == "__main__":
    album_id = sys.argv[1]
    album_details = fetch_album_details(album_id)
    print(json.dumps(album_details))
