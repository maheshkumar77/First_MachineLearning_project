from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "hello world"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        features = [
            float(data["age"]),
            float(data["sex"]),
            float(data["cp"]),
            float(data["trestbps"]),
            float(data["chol"]),
            float(data["fbs"]),
            float(data["restecg"]),
            float(data["thalach"]),
            float(data["exang"]),
            float(data["oldpeak"]),
            float(data["slope"]),
            float(data["ca"]),
            float(data["thal"]),
        ]
    except (KeyError, ValueError, TypeError):
        return jsonify({
            "error": "Invalid or missing input values"
        }), 400

    final_features = np.array([features])

    prediction = model.predict(final_features)[0]

    result = "Heart Disease Detected ❤️" if prediction == 1 else "No Heart Disease ✅"

    return jsonify({
        "prediction": int(prediction),
        "result": result
    })

    data = request.get_json()

    features = [
        data["age"],
        data["sex"],
        data["cp"],
        data["trestbps"],
        data["chol"],
        data["fbs"],
        data["restecg"],
        data["thalach"],
        data["exang"],
        data["oldpeak"],
        data["slope"],
        data["ca"],
        data["thal"]
    ]

    final_features = np.array([features], dtype=float)

    prediction = model.predict(final_features)[0]
    print(prediction)

    result = "Heart Disease Detected ❤️" if prediction == 1 else "No Heart Disease ✅"

    return jsonify({
        "prediction": int(prediction),
        "result": result
    })

if __name__ == "__main__":
    app.run(debug=True)
