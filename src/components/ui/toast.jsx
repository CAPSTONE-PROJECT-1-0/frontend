"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Toast = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "z-[100] flex w-full max-w-[380px] items-center space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-value)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[calc(100%+25px)]",
        className,
      )}
      {...props}
    >
      {children}
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastProvider = ToastPrimitives.Provider
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex list-none flex-col p-4 sm:right-8 sm:top-[unset] sm:bottom-8",
        className,
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn("text-sm font-semibold [&+div]:text-xs", className)}
      {...props}
    />
  )
})
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn("text-sm opacity-70", className)}
      {...props}
    />
  )
})
ToastDescription.displayName = ToastPrimitives.Description.displayName

const ToastClose = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Close ref={ref} asChild>
      <Button
        variant="ghost"
        className={cn("absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-500", className)}
        {...props}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M11.7812 4.03125L10.9688 3.21875L7.5 6.6875L4.03125 3.21875L3.21875 4.03125L6.6875 7.5L3.21875 10.9688L4.03125 11.7812L7.5 8.3125L10.9688 11.7812L11.7812 10.9688L8.3125 7.5L11.7812 4.03125Z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only">Close</span>
      </Button>
    </ToastPrimitives.Close>
  )
})
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastAction = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 items-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-zinc-800",
        className,
      )}
      {...props}
    />
  )
})
ToastAction.displayName = ToastPrimitives.Action.displayName

/**
 * Hook untuk memicu toast
 * @returns {{ toast: (props: any) => void }}
 */
function useToast() {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback(
    (props) => {
      setToasts([...toasts, { ...props, id: String(Math.random()) }])
    },
    [toasts]
  )

  return React.useMemo(() => ({ toast }), [toast])
}

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  useToast,
}
