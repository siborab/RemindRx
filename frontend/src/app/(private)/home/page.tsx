'use client'

import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atoms"
import { toast } from "sonner";
import TimeOfDay from '../components/timeOfDay'
import { RecommendedTimePrescription } from "@/types/PrecriptionData";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Loading from "@/app/components/loading";
import CameraPost from "../components/camera";

export default function HomePage() {
  const userInfo = useAtomValue(userAtom);
  const [prescriptions, setPrescriptions] = useState<RecommendedTimePrescription[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getPrescriptionData() {
        setLoading(true);

      const { data, error } = await supabase
                              .from('recommended_times')
                              .select(`
                                recommended_time,
                                isTaken,
                                prescription:prescriptions(*) (
                                  *
                                )
                              `)
                              .eq('patient_id', 6)
                              .returns<RecommendedTimePrescription[]>();
      console.log(data);
  
      if (error) {
        console.error("Error fetching prescriptions:", error);
        toast.error("Failed to load prescriptions");
      } else {
        setPrescriptions(data!);
      }
    }

    if (userInfo) {
      getPrescriptionData();
    }

  }, []);

  if (loading) {
    return (<Loading />);
  }


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
