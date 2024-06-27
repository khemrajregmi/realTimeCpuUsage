export async function getCpuUsage() {
    const request = await fetch(import.meta.env.VITE_BASE_API_URL + '/cpu/last-minute', {
      method: 'GET',
    })
  
    return await request.json()
  }
  
  export async function getCpuUsageForPeriod(period: Record<string, string>) {
    console.log({
      period
    })
  
    const stringParams = new URLSearchParams(period).toString()
  
    const request = await fetch(import.meta.env.VITE_BASE_API_URL + '/cpu/period' + '?' + stringParams, {
      method: 'GET',
    })
  
    return await request.json()
  }
  