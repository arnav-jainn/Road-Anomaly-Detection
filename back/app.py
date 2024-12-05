from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the pre-trained CNN model
model_path = 'back/my_model.h5'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at: {model_path}")
model = load_model(model_path)

# Define labels for the classes (make sure these match your model's classes)
labels = {
    0: "Road Anomaly Type Accident",
    1: "Road Anomaly Type Fight",
    2: "Road Anomaly Type Fire",
    3: "No Accident",
    4: "Road Anomaly Type Snatching"  # Add Snatching class here
}

# Define folder for uploading images
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Helper function to preprocess image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # match the target size of your model
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img /= 255.0  # same scaling as used during training
    return img

# Define the prediction route
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save file securely
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        file.save(filepath)
        
        # Preprocess the image and make predictions
        img = preprocess_image(filepath)
        predictions = model.predict(img)
        predicted_class = np.argmax(predictions)
        predicted_label = labels.get(predicted_class, "Unknown Anomaly")  # Ensure label exists

        return jsonify({
            'message': f'This image contains a {predicted_label}',
            'accident_type': predicted_label,
            'confidence': float(np.max(predictions))  # Optional: if you want to send confidence as well
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a welcome GET route
@app.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to this API!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
