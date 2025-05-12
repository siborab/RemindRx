'use client'

import { Prescription } from "@/types/PrecriptionData"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { markTaken } from "../home/actions"

interface Props {
    prescription: Prescription,
    recommended_time: string,
    id: number,
    isTaken: boolean,
}

export default function PillCard({prescription, recommended_time, id, isTaken}: Props) {

    const [isChecked, setIsChecked] = useState<boolean>(isTaken);

    async function handleCheck() {
        if (!isChecked) {
            setIsChecked(true)
            const response = await markTaken(id);
            if (response.error) {
                toast.error('Something went wrong checking off:' + prescription.medication)
            } else {
                toast.success('Successfully checked ' + prescription.medication);
            }
        }
    }
    
    return (
        <div className={`border shadow-md flex items-center space-x-4 ${isChecked ? "bg-green-50" : "bg-white"} rounded-lg p-4 space-y-3`}>
            <div>
                <Checkbox 
                    checked={isChecked}
                    onClick={handleCheck}
                />
            </div>
            <div >
                <div className="flex flex-col">
                    <div className="">
                        <div
                            className={`font-medium text-lg cursor-pointer ${isChecked ? "line-through text-muted-foreground" : ""}`}
                        >
                            {prescription.medication ? prescription.medication : 'No name'}
                        </div>
                        <div className="">Recommended Time: {recommended_time}</div>
                    </div>
                    <div className="text-md flex items-center gap-1 pb-1">
                        {prescription.amount}mg - {prescription.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Refill Time: {prescription.refill_time}
                    </div>
                </div>
            </div>
        </div>
    )
}