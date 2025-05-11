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
        <DialogTrigger className="bg-purple-500 text-white px-4 py-2 rounded-2xl hover:bg-purple-400">Add Medication</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Medication</DialogTitle>
          </DialogHeader>
          <div className="">
              {!image && (
                  <CameraCapture onCapture={handleCapture} />
              )}
          </div>
        </DialogContent>
    </Dialog>
  );
}