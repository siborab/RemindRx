import { Prescription } from "@/types/UserData"
import PillCard from "./pillCard"

interface Props {
    prescriptions: Prescription[],
    timeOfDay: string,
}


export default function TimeOfDay({prescriptions, timeOfDay}: Props) {


    const pillCards = prescriptions.map((prescription) => {
        return (<PillCard key={prescription.id} prescription={prescription}></PillCard>)
    })

    return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">{timeOfDay}</h2>
          <p className="text-sm text-gray-500">{prescriptions.length} medications scheduled</p>
        </div>
        <div className="p-2 space-y-2">
          {pillCards.length > 0 ? (pillCards) : (
            <p className="text-center py-2 text-gray-500 text-sm">
              No medications scheduled for {timeOfDay.toLowerCase()}
            </p>
          )}
        </div>
    </div>
  
    )
}