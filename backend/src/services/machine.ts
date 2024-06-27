import osu from 'node-os-utils'
import os from 'os'

export async function getMachineStats () {
  return {
    memory: await osu.mem.info(),
    users: await osu.users.openedCount(),
    os: osu.os,
    platform: os.platform(),
    type: os.type(),
    cores: os.cpus().length,
    uptime: os.uptime(),
  }
}
