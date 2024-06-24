// src/index.ts

import express, { Request, Response } from 'express';
import os from 'os';
import { InfluxDB, FieldType } from 'influx';

const app = express();
const port = 3001;

// Setup InfluxDB
const influx = new InfluxDB({
  host: 'localhost',
  database: 'system_metrics',
  schema: [
    {
      measurement: 'cpu_ram_usage',
      fields: {
        cpu_usage: FieldType.FLOAT,
        ram_usage: FieldType.FLOAT,
      },
      tags: ['host'],
    },
  ],
});

// Create database if it doesn't exist
influx.getDatabaseNames().then(names => {
  if (!names.includes('system_metrics')) {
    return influx.createDatabase('system_metrics');
  }
});

// Function to get CPU and RAM usage
const getSystemMetrics = () => {
  const cpus = os.cpus();
  const cpuUsage = cpus.map(cpu => {
    let total = 0;
    for (const type in cpu.times) {
      total += cpu.times[type as keyof typeof cpu.times];
    }
    return {
      model: cpu.model,
      speed: cpu.speed,
      usage: ((cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq) / total) * 100,
    };
  });

  const ramUsage = (os.totalmem() - os.freemem()) / os.totalmem() * 100;

  return {
    cpuUsage: cpuUsage[0].usage,
    ramUsage: ramUsage,
  };
};

// Endpoint to send data to InfluxDB
setInterval(() => {
  const { cpuUsage, ramUsage } = getSystemMetrics();
  influx.writePoints([
    {
      measurement: 'cpu_ram_usage',
      tags: { host: os.hostname() },
      fields: { cpu_usage: cpuUsage, ram_usage: ramUsage },
    },
  ]);
}, 5000);

// Endpoint to get data for the frontend
app.get('/api/metrics', async (req: Request, res: Response) => {
  try {
    const result = await influx.query(`
      select * from cpu_ram_usage
      order by time desc
      limit 20
    `);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
