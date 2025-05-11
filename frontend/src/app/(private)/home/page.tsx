'use client'

import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atoms"
import { toast } from "sonner";
import TimeOfDay from '../components/timeOfDay'
import { RecommendedTimePrescription } from "@/types/PrecriptionData";
import { useEffect, useState } from "react";
import CameraPost from "../components/camera";
import getPrescriptions from "./actions";

export default function HomePage() {
  const userInfo = useAtomValue(userAtom);
  const [prescriptions, setPrescriptions] = useState<RecommendedTimePrescription[]>([])

  useEffect(() => {
    async function getPrescriptionData() {
      const data = await getPrescriptions(6)
      if (data.error) {
        console.error("Error fetching prescriptions:", data.error);
        toast.error("Failed to load prescriptions");
      } else {
        setPrescriptions(data?.data!);
      }
    }

    if (userInfo) {
      getPrescriptionData();
    }

  }, [userInfo]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{userInfo?.first_name}'s Prescriptions</h1>
        <CameraPost/>
      </div>

      <div className="space-y-6">
        <TimeOfDay prescriptions={prescriptions} timeOfDay="Morning" />
        <TimeOfDay prescriptions={prescriptions} timeOfDay="Afternoon" />
        <TimeOfDay prescriptions={prescriptions} timeOfDay="Evening" />
      </div>
    </div>
  )
}
