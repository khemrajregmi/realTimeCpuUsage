import { deleteAllStats, getCpuUsage, getLastMinuteStats, getStatsForCustomPeriod } from "../controllers/cpuController";

const express  = require('express');

const router = express.Router();

console.log('CPU routes');

router.post('/', getCpuUsage);
router.delete('/', deleteAllStats);
router.get('/period', getStatsForCustomPeriod);
router.get('/last-minute', getLastMinuteStats);

module.exports = router;
