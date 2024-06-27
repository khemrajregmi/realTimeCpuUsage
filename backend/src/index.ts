import { Server } from "socket.io";
import mongoose from 'mongoose';
import cors from 'cors'
import express from 'express'
import body from 'body-parser'
import dotenv from 'dotenv'

import CpuUsage from './models/cpu'
import cpuUsageJob from './jobs/cpuUsageCollector'
import { getMachineStats } from "./services/machine";

dotenv.config()

const UPDATE_FREQUENCY = 1000 * 1; // 1 seconds

async function start() {
  try {

    const app = express();

    app.use(cors({
      origin: '*',
    }))

    /**
     * Connecting Mongoose
     * @param uris
     * @param options
     */
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      socketTimeoutMS: 0,
      maxPoolSize: 1000
    })

    mongoose.connection.on("error", (res) => {
      throw new Error(`unable to connect to database`);
    });

    app.db = db;

    // body parser

    app.use(body.json({
      limit: '500kb'
    }));

    // Routes

    app.use('/cpu', require('./routes/cpu'));

    const io = new Server({
      cors: {
        origin: '*'
      }
    });

    // Start server
    let interval
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
      interval = setInterval(() => {
        CpuUsage.findOne().sort({ timestamp: -1 }).then((doc) => {
          getMachineStats().then((machine) => {
            io.emit('cpuUsageUpdate', {
              usage: doc,
              machine
            });
          })
        })
      }, UPDATE_FREQUENCY);
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
    });

    io.on('disconnect', () => {
      console.log('user disconnected');
    })

    io.listen(4001)

    cpuUsageJob()
  }
  catch(error) {
    console.log(error);
  }
}

start()