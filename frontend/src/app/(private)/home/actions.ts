import { RecommendedTimePrescription } from "@/types/PrecriptionData";

export async function getPrescriptions(patient_id: number): Promise<{
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

export async function markTaken(recommended_time_id: number): Promise<{
    error: Error | null;}> 
{
    try {
        const response = await fetch("http://127.0.0.1:8080/api/make-prescription-taken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommended_time_id: recommended_time_id }),
        });

        const json = await response.json();

        if (!response.ok) {
        return {
            error: new Error(json.error ?? "Failed to check off prescription time"),
        };
        }

        return { error: null };
    } catch (err: any) {
        return { error: err };
    }
}