import { supabase } from "@/utils/supabase/client";
import { RecommendedTimePrescription } from "@/types/PrecriptionData";

export default async function getPrescriptions(patient_id: number): Promise<{
  data: RecommendedTimePrescription[] | null;
  error: Error | null;
}> {

  try {
    const response = await fetch("http://127.0.0.1:8080/api/prescriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patient_id: patient_id }),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: [],
        error: new Error(json.error ?? "Failed to fetch prescriptions"),
      };
    }
    
    return { data: json as RecommendedTimePrescription[], error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}
