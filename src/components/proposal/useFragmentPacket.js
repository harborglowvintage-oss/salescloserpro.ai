/**
 * salescloserpro.ai - decode the packet carried in the URL #fragment
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Re-decodes on `hashchange`: opening a second link in the same tab only changes the
 * fragment (no page load), and must not keep showing the previous proposal.
 */

import { useEffect, useState } from 'react'
import { decodePacket, currentFragment } from '../../utils/proposalLink'

/**
 * @param {(packet: any) => boolean} isValid  shape check for the expected packet
 * @returns {undefined | null | any}  undefined while decoding, null if broken, else the packet
 */
export default function useFragmentPacket(isValid) {
  const [packet, setPacket] = useState(undefined)

  useEffect(() => {
    let run = 0
    const decode = async () => {
      const mine = ++run
      setPacket(undefined)
      let result = null
      try {
        const p = await decodePacket(currentFragment())
        result = isValid(p) ? p : null
      } catch { /* truncated or tampered link */ }
      if (mine === run) setPacket(result)
    }
    decode()
    window.addEventListener('hashchange', decode)
    return () => { run++; window.removeEventListener('hashchange', decode) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- isValid is a static shape check

  return packet
}
