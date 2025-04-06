'use client'

import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atoms"

export default function HomePage () {
  const userInfo = useAtomValue(userAtom);

  
  return (
    <div>
      <div>Hi {userInfo?.first_name}</div>
    </div>
  )
}
