from flask import Flask, Response, request, jsonify
from generate_prediction import generate_prediction
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys

app = Flask(__name__)
cors = CORS(app)


@app.route("/image", methods=['GET', 'POST'])
def image():
    if request.method == "POST":
        bytesOfImage = base64.decodebytes(request.get_data())
        print("RECEIVED POST REQUEST:")
        with open('image.jpeg', 'wb') as out:
            out.write(bytesOfImage)
            out.close()

        print("GENERATING PREDICTION")
        prediction = "No Prediction"

        try:
            prediction = generate_prediction("./image.jpeg")
        except Exception as e:
            print("Exception while generating prediction: ", e.__str__())
            prediction = "Error"

        prediction = prediction.replace("_"," ")
        print("PREDICTION:",prediction)

        return prediction, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
