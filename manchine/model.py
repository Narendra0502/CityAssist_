import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

# Set dataset paths
DATASET_DIR = "C:\\Users\\naren\\OneDrive\\Desktop\\CityAssist\\datasets\\clean_dirty_road\\Images\\Images"
IMG_SIZE = (150, 150)  # Resize images to 150x150

# Load images and labels
X, y = [], []

for filename in os.listdir(DATASET_DIR):
    filepath = os.path.join(DATASET_DIR, filename)
    
    # Read and resize image
    img = cv2.imread(filepath)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0  # Normalize

    # Label images based on filename
    if filename.startswith("clean"):
        label = 0  # Clean Road
    elif filename.startswith("dirty"):
        label = 1  # Dirty Road
    else:
        continue  # Skip unknown files

    X.append(img)
    y.append(label)

# Convert to NumPy arrays
X = np.array(X)
y = np.array(y)

# Split dataset into Train (80%) and Test (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define CNN Model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    MaxPooling2D(2, 2),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')  # Output: Binary classification
])

# Compile Model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train Model
EPOCHS = 10
history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=EPOCHS, batch_size=32)

# Save Model
model.save("road_classifier_cnn.h5")

# Plot Training Results
plt.plot(history.history["accuracy"], label="Train Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
plt.legend()
plt.show()
