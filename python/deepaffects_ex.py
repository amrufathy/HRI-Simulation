import os
import time
from collections import Counter
from flask import Flask, request
from flask_cors import CORS
from deepaffects.realtime.util import chunk_generator_from_file, get_deepaffects_client

app = Flask(__name__)
CORS(app)

# Set file_path as local file path or audio stream or youtube url
# file_path = "/home/amr/Downloads/answerToQuestion0.mp3"
base_path = "/home/amr/Downloads/"

# DeepAffects realtime Api client
da_client = get_deepaffects_client()

metadata = [
    ("apikey", "sDzcFAy0WjsdeSzBMGSlXpbJR8r9PCIb"),
    ("encoding", "wav"),
    ("samplerate", "16000"),
    ("languagecode", "en-US"),
]

"""Generator Function

chunk_generator_from_file is the Sample implementation for generator funcion which reads audio from a file and splits it into
base64 encoded audio segment of more than 3 sec
and yields SegmentChunk object using segment_chunk

"""

# from deepaffects.realtime.types import segment_chunk
# segment_chunk(Args)

"""segment_chunk.

Args:
    encoding : Audio Encoding,
    languageCode: language code ,
    sampleRate: sample rate of audio ,
    content: base64 encoded audio,
    segmentOffset: offset of the segment in complete audio stream
"""

# Call client api function with generator and metadata


@app.route("/emotion")
def get_emotion():
    file_name = request.args.get("file_name")
    file_path = f"{base_path}{file_name}"

    while not os.path.exists(file_path):
        time.sleep(1)

    if os.path.isfile(file_path):
        d = dict()

        responses = da_client.IdentifyEmotion(
            chunk_generator_from_file(file_path), 2000, metadata=metadata
        )

        # responses is the iterator for all the response values
        for response in responses:
            d[response.emotion] = d.get(response.emotion, 0) + 1
            print("Received message\n", response)

        d = Counter(d)
        word, _ = d.most_common(1)[0]
        print(f"most common sentiment: {word.lower()}")

        return word.lower()
    else:
        print(f"{file_path} isn't a file!")
        return "error"


app.run(debug=True, port="5001")

"""Response.
    response = {
        emotion: Emotion identified in the segment,
        start: start of the segment,
        end: end of the segment
    }
"""
