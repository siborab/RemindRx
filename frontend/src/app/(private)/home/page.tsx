'use client'

import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atoms"
import { toast } from "sonner";

export default function HomePage () {
  const userInfo = useAtomValue(userAtom);

  
  return (
    <div>
      <div>Hi {userInfo?.first_name}</div>
      <button onClick={() => {toast.info('hi there')}}>Test</button>
    </div>
  )
}
