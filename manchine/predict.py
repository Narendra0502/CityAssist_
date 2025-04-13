import numpy as np
import tensorflow as tf
import cv2

# Load trained model
model = tf.keras.models.load_model("C:\\Users\\naren\\OneDrive\\Desktop\\CityAssist\\manchine\\road_classifier_cnn.h5")

# Load & preprocess image
img_path = "C:\\Users\\naren\\OneDrive\\Desktop\\OIP.jpeg"  # Change path
img = cv2.imread(img_path)
img = cv2.resize(img, (150, 150))
img = img / 255.0  # Normalize
img = np.expand_dims(img, axis=0)  # Add batch dimension

# Predict
prediction = model.predict(img)[0][0]
print("Prediction:", "Clean Road" if prediction < 0.5 else "Dirty Road")
