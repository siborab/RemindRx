"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { useState } from "react";
import CameraCapture from "./cameraCapture";
import PrescriptionForm from "./prescriptionForm";
import { PrescriptionFormData } from "@/types/PrecriptionData";


export default function CameraPost() {
  const [image, setImage] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionFormData>({
    name: "",
    refillTime: "",
    refills: "",
    amount: ""
  });

  const handleCapture = (capturedImage: File) => {
    setImage(capturedImage);
  };

  const handleFormSubmit = (formData: {
    name: string;
    refillTime: string;
    refills: string;
    amount: string;
  }) => {
    setPrescriptionData(formData);
    setShowCamera(true);
  };

  const handleReset = () => {
    setImage(null);
    setShowCamera(false);
    setPrescriptionData({
      name: "",
      refillTime: "",
      refills: "",
      amount: ""
    });
  };

  return (
    <Dialog>
        <DialogTrigger className="bg-purple-500 text-white px-4 py-2 rounded-2xl hover:bg-purple-400">Add Medication</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Medication</DialogTitle>
          </DialogHeader>
          <div className="">
            {!showCamera ? (
              <PrescriptionForm onSubmit={handleFormSubmit} />
            ) : (
              !image && (
                <CameraCapture 
                  onCapture={handleCapture} 
                  prescriptionData={prescriptionData}
                  reset={handleReset}
                />
              )
            )}
          </div>
        </DialogContent>
    </Dialog>
  );
}