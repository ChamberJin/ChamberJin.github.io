import { VERSION_ANCHOR, VERSION_DAYS, VERSION_CAPS, VERSION_COLORS, VERSION_COLOR_DEFAULT } from '../utils/constants.js'

export function useVersion() {
  function getVersion(date) {
    const diffDays = Math.floor((date - VERSION_ANCHOR.date) / 86400000)
    const versionOffset = Math.floor(diffDays / VERSION_DAYS)

    let major = VERSION_ANCHOR.major
    let minor = VERSION_ANCHOR.minor

    if (versionOffset > 0) {
      for (let i = 0; i < versionOffset; i++) {
        minor++
        if (major >= 5) continue
        const cap = VERSION_CAPS[major]
        if (minor > cap) { minor = 0; major++ }
      }
    } else if (versionOffset < 0) {
      for (let i = 0; i < -versionOffset; i++) {
        minor--
        if (minor < 0) {
          major--
          if (major < 0) return null
          const cap = VERSION_CAPS[major] !== undefined ? VERSION_CAPS[major] : 0
          minor = cap
        }
      }
    }

    return { major, minor }
  }

  function getVersionLabel(ver) {
    return ver ? `v${ver.major}.${ver.minor}` : ''
  }

  function getVersionColor(ver) {
    if (!ver) return VERSION_COLOR_DEFAULT
    return VERSION_COLORS[ver.major] || VERSION_COLOR_DEFAULT
  }

  return { getVersion, getVersionLabel, getVersionColor }
}
