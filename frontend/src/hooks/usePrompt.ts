import type { Transition } from 'history'
import { useCallback } from 'react'
import useBlocker from './useBlocker'

/**
 * @source https://github.com/remix-run/react-router/issues/8139#issuecomment-1023105785
 */
export default function usePrompt(
  message:
    | string
    | ((
        location: Transition['location'],
        action: Transition['action']
      ) => string),
  when = true
) {
  const blocker = useCallback(
    (tx: Transition) => {
      let response
      if (typeof message === 'function') {
        response = message(tx.location, tx.action)
        if (typeof response === 'string') {
          response = window.confirm(response)
        }
      } else {
        response = window.confirm(message)
      }
      if (response) {
        tx.retry()
      }
    },
    [message]
  )
  return useBlocker(blocker, when)
}
