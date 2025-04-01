import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Toaster, toast } from  'react-hot-toast';

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: "environment",
  aspectRatio: 16/9,
  quality: 1
};

const Camera = ({ imagehandler }) => {
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);

  const base64ToFile = (base64String) => {
    // Remove data URL prefix
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, "");
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    return new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
  };

  const checkImageContent = (pngDataURL) => {
    return new Promise((resolve, reject) => {
      // Create a Blob object from the data URL
      fetch(pngDataURL)
        .then(res => res.blob())
        .then(blob => {
          // Create a FormData object and append the PNG image file
          var formData = new FormData();
          formData.append('media', blob);
          formData.append('models', 'nudity-2.0,wad,offensive,text-content,face-attributes,gore,genai');
          formData.append('api_user', '432766867');
          formData.append('api_secret', 'gqDBf6rT8vTx87g3FBqaTp3Dmim3uatc');

          var xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://api.sightengine.com/1.0/check.json', true);
          xhr.onload = function () {
            if (xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error('Error occurred while uploading image.'));
            }
          };
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(formData);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const displayOutput = (response) => {
    const fieldsToCheck = ['alcohol', 'drugs', 'gore', 'medical_drugs', 'offensive', 'recreational_drugs', 'skull', 'tobacco', 'weapon', 'weapon_firearm', 'weapon_knife'];

    for (let fieldName of fieldsToCheck) {
      if (response.hasOwnProperty(fieldName)) {
        const fieldValue = response[fieldName];

        if ((typeof fieldValue === 'number' && fieldValue > 0.5) || 
            (typeof fieldValue === 'object' && fieldValue.prob && fieldValue.prob > 0.5)) {
          toast.error("The image contains inappropriate content.");
          return false;
        }
      }
    }

    const nudityObj = response.nudity;
    if (nudityObj) {
      if (nudityObj.none && nudityObj.none > 0.8) {
        return true;
      }

      const nudityContext = nudityObj.context;
      if (nudityContext) {
        for (let key in nudityContext) {
          if (key !== 'none' && nudityContext.hasOwnProperty(key) && 
              typeof nudityContext[key] === 'number' && nudityContext[key] > 0.5) {
            toast.error("The image contains inappropriate content.");
            return false;
          }
        }
      }
    }

    const offensiveObj = response.offensive;
    if (offensiveObj) {
      for (let key in offensiveObj) {
        if (offensiveObj.hasOwnProperty(key) && 
            typeof offensiveObj[key] === 'number' && offensiveObj[key] > 0.5) {
          toast.error("The image contains inappropriate content.");
          return false;
        }
      }
    }

    toast.success("The image passed content moderation.");
    return true;
  };

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("image camera ke under ", imageSrc);
    
    try {
      const response = await checkImageContent(imageSrc);
      const isAppropriate = displayOutput(response);
      
      if (isAppropriate) {
        setUrl(imageSrc);
        imagehandler(imageSrc);
      }
    } catch (error) {
      console.error("Error checking image content:", error);
      toast.error("Failed to check image content.");
    }
  }, [webcamRef, imagehandler]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <div className="relative w-[400px] h-[300px] border border-gray-300 shadow-lg flex flex-col items-center">
      <Toaster position="top-center" richColors />
      
      {/* Show webcam or captured image */}
      {!url ? (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored={true}
          onUserMedia={onUserMedia}
          className="w-full h-full"
          screenshotQuality={1}
          forceScreenshotSourceSize={true}
        />
      ) : (
        <img
          src={url}
          alt="Captured"
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        {!url ? (
          <button
            onClick={capturePhoto}
            className="w-60 text-lg mb-4 h-[50px] bg-orange-300 rounded-full"
          >
            Capture
          </button>
        ) : (
          <button
            onClick={() => setUrl(null)}
            className="w-60 text-lg h-[50px] bg-red-500 text-white rounded-full"
          >
            Retake
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;