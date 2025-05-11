"use client"

// Simplified version of the toast hook
import { useToast as useToastOriginal } from "@/components/ui/toast"

export function useToast() {
  const toast = useToastOriginal
    ? useToastOriginal()
    : {
        toast: ({ title, description, variant }) => {
          console.log({ title, description, variant })
        },
      }
  return toast
}
