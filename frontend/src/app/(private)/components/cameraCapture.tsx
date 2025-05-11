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

      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-64 h-48 border rounded"
          />
          {!cameraActive ? (
            <button
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
              onClick={startCamera}
            >
              Start Camera
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              onClick={captureImage}
            >
              Capture
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="bg-gray-100 px-2 py-2 rounded"
          />
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-64 h-48 border rounded"
          />
          <div className="flex space-x-2 mt-2">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setCapturedImage(null);
                setFile(null);
              }}
            >
              Retake
            </button>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Next"}
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};


export default CameraCapture;