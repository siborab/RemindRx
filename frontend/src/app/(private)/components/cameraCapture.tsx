"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { PrescriptionFormData } from "@/types/PrecriptionData";

interface CameraProps {
  onCapture: (image: File) => void;
  prescriptionData: PrescriptionFormData;
  reset: () => void;
}

const CameraCapture = ({ onCapture, prescriptionData, reset }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStream(stream);
      setCameraActive(true);
    } catch (error) {
      toast.error("Error accessing camera");
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);

    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `captured-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setFile(file);
      });

    stopCamera();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };


  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    onCapture(file);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", prescriptionData.name);
      formData.append("refillTime", prescriptionData.refillTime);
      formData.append("refills", prescriptionData.refills);
      formData.append("amount", prescriptionData.amount);

      const res = await fetch("http://127.0.0.1:8080/api/models/scan", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();
      if (data.times && data.times.length > 0) {
        toast.success(`Medication ${prescriptionData.name} added successfully! Recommended times: ${data.times.join(", ")}`);
      } else {
        toast.success(`Medication ${prescriptionData.name} added successfully!`);
      }
      console.log(data);
    } catch (err) {
      console.error("Error scanning image:", err);
      toast.error("Failed to add medication. Please try again.");
    } finally {
      setLoading(false);
      reset();
    }
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setCapturedImage(url);
    setFile(f);
    stopCamera();
  };


  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium">Add photo of {prescriptionData.name}</h3>
        <p className="text-sm text-gray-500">Take a clear picture of your prescription label</p>
      </div>

      {!capturedImage ? (
        <>
          <div className="overflow-hidden rounded-lg shadow-md bg-gray-50 p-2 w-72">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-56 rounded object-cover border border-gray-200"
            />
            
            <div className="mt-3 flex flex-col gap-2">
              {!cameraActive ? (
                <button
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  onClick={startCamera}
                >
                  Start Camera
                </button>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={captureImage}
                >
                  Capture Photo
                </button>
              )}
              
              <div className="relative w-full mt-2">
                <label className="w-full cursor-pointer flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg shadow-md bg-gray-50 p-2 w-72">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-56 rounded object-cover border border-gray-200"
            />
            
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setCapturedImage(null);
                  setFile(null);
                }}
              >
                Retake
              </button>
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : "Submit"}
              </button>
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};


export default CameraCapture;