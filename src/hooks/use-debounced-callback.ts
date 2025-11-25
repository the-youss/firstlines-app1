/**
 * useDebouncedCallback – safely debounce a callback, avoiding flushSync errors.
 * Inspired by Mantine hooks.
 */

import * as React from "react"
import { useCallbackRef } from "@/hooks/use-callback-ref"

type DebouncedFunction<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): DebouncedFunction<T> {
  const handleCallback = useCallbackRef(callback)
  const debounceTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = window.setTimeout(() => {
        // Ensure it's deferred outside the React render lifecycle
        queueMicrotask(() => {
          handleCallback(...args)
        })
      }, delay)
    },
    [handleCallback, delay]
  )

  const cancel = React.useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  return Object.assign(debouncedFn, { cancel })
}
