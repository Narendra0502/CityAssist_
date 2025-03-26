import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: "environment",
  aspectRatio: 16/9,
  quality: 1
};

const Camera = ({imagehandler}) => {
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

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("imagea camera ke under ",imageSrc);
    setUrl(imageSrc);

    const imageFile = base64ToFile(imageSrc);
    imagehandler(imageSrc);
  }, [webcamRef,imagehandler]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <div className="relative w-[400px] h-[300px] border border-gray-300 shadow-lg flex flex-col items-center">
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
