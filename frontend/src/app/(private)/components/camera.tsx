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

interface ApiData {
  title: string;
  description: string;
  category: string;
  tags: string;
  severity: string;
}

export default function CameraPost() {
  const [image, setImage] = useState<File | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);

  const handleCapture = (capturedImage: File) => {
    setImage(capturedImage);
  };

  const handleApiResponse = (data: ApiData) => {
    setApiData(data);
  };

  return (
    <Dialog>
        <DialogTrigger>Add Medication</DialogTrigger>
        <DialogContent>
            <div className="">
                {!image && (
                    <CameraCapture onCapture={handleCapture} />
                )}
            </div>
        </DialogContent>
    </Dialog>
  );
}