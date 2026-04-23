require('dotenv').config();
const ZKLib = require('node-zklib');
const axios = require('axios');
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const DEVICE_IP = process.env.DEVICE_IP || '192.168.1.201';
const DEVICE_PORT = parseInt(process.env.DEVICE_PORT || '4370');
const HRIS_API_URL = process.env.HRIS_API_URL || 'https://hris.maskpro.ph/api';
const HRIS_API_KEY = process.env.HRIS_API_KEY;
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Serve Kiosk Static Files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('[Socket] Kiosk Display Connected');
});

const initBridge = async () => {
    console.log(`[MaskPro Biometric Bridge & Kiosk Server] Starting...`);
    console.log(`Target Device: ${DEVICE_IP}:${DEVICE_PORT}`);
    console.log(`Kiosk Display running on: http://localhost:${PORT}`);

    const zkInstance = new ZKLib(DEVICE_IP, DEVICE_PORT, 10000, 4000);

    const connectDevice = async () => {
        try {
            await zkInstance.createSocket();
            console.log('[ZKTeco] Connected to biometric device.');

            // Listen for Real-Time Punches
            zkInstance.getRealTimeLogs(async (data) => {
                console.log('[ZKTeco] Real-time punch detected:', data);
                
                // data format depends on ZKLib, usually: { userId: '1', attTime: '...', attState: 1 }
                const uid = data.userId || data.deviceUserId;
                const timestamp = data.attTime || data.recordTime || new Date().toISOString();

                // 1. Send punch to Kiosk UI instantly
                try {
                    // Fetch user details from Cloud HRIS
                    const userRes = await axios.get(`${HRIS_API_URL}/employees/biometric/${uid}`, {
                        headers: { 'x-api-key': HRIS_API_KEY }
                    });
                    
                    if (userRes.data && userRes.data.success) {
                        io.emit('punch', {
                            success: true,
                            timestamp: timestamp,
                            user: userRes.data.data // { full_name, job_title, profile_picture }
                        });
                    }
                } catch (err) {
                    // If cloud fetch fails or user not mapped, still show unknown punch
                    io.emit('punch', {
                        success: true,
                        timestamp: timestamp,
                        user: { full_name: `Employee ID: ${uid}`, job_title: 'Unregistered or Offline' }
                    });
                }

                // 2. Sync punch to Cloud HRIS
                try {
                    await axios.post(`${HRIS_API_URL}/attendance/sync`, {
                        logs: [{ biometric_uid: uid, timestamp: timestamp, status: data.attState || 1 }]
                    }, {
                        headers: { 'x-api-key': HRIS_API_KEY, 'Content-Type': 'application/json' }
                    });
                } catch (err) {
                    console.error('[Cloud Sync Error] Failed to push real-time log.');
                }
            });

        } catch (err) {
            console.error('[DEVICE ERROR]', err.message || err);
            setTimeout(connectDevice, 10000); // Reconnect loop
        }
    };

    await connectDevice();
};

server.listen(PORT, () => {
    initBridge();
});
