require('dotenv').config();
const ZKLib = require('zklib');
const axios = require('axios');

const DEVICE_IP = process.env.DEVICE_IP;
const DEVICE_PORT = parseInt(process.env.DEVICE_PORT || '4370');
const HRIS_API_URL = process.env.HRIS_API_URL;
const HRIS_API_KEY = process.env.HRIS_API_KEY;
const POLL_INTERVAL_MS = 60000; // Poll every 60 seconds

// We store the last log index we processed to avoid resending the entire device history.
// In a robust production app, this state should be saved to a local SQLite or JSON file.
// For simplicity in this bridge, we fetch all logs and let the server's IGNORE logic handle duplicates.
// However, memory optimization is better.

const initBridge = async () => {
    console.log(`[MaskPro Biometric Bridge] Starting...`);
    console.log(`Target Device: ${DEVICE_IP}:${DEVICE_PORT}`);
    console.log(`HRIS EndPoint: ${HRIS_API_URL}`);

    const zkInstance = new ZKLib({
        ip: DEVICE_IP,
        port: DEVICE_PORT,
        inport: 5200,
        timeout: 10000
    });

    const connectAndFetch = async () => {
        try {
            await zkInstance.createSocket();
            console.log('Connected to biometric device.');

            const logs = await zkInstance.getAttendances();
            console.log(`Fetched ${logs.data.length} total attendance records from device.`);

            if (logs.data.length > 0) {
                // We map the ZKLib logs to our HRIS format
                // ZKLib format: { userSn, deviceUserId, recordTime, ip, ... }
                const formattedLogs = logs.data.map(log => ({
                    biometric_uid: log.deviceUserId,
                    timestamp: log.recordTime, // usually a JS Date string
                    status: 1 // default punch status if device doesn't distinguish In/Out
                }));

                // Push to MaskPro HRIS API
                try {
                    const response = await axios.post(`${HRIS_API_URL}/attendance/sync`, {
                        logs: formattedLogs
                    }, {
                        headers: {
                            'x-api-key': HRIS_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log(`[HRIS SYNC] Successfully pushed records: ${response.data.message}`);
                } catch (apiError) {
                    console.error('[HRIS SYNC ERROR]', apiError.response ? apiError.response.data : apiError.message);
                }
            }

            // Disconnect to free up the device port
            await zkInstance.disconnect();
            
        } catch (err) {
            console.error('[DEVICE ERROR]', err.message || err);
            // Ensure socket is closed on error
            try { await zkInstance.disconnect(); } catch (e) {}
        }
    };

    // Run once immediately, then interval
    await connectAndFetch();
    
    setInterval(async () => {
        console.log(`[${new Date().toLocaleString()}] Polling device...`);
        await connectAndFetch();
    }, POLL_INTERVAL_MS);
};

initBridge();
