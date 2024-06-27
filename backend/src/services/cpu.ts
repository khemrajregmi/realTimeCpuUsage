import osu from 'node-os-utils'

export function getCpuUsage () {
  return osu.cpu.usage()
}
