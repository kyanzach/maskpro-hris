# MaskPro Biometric Bridge

This script is designed to run on the mini-PC connected to the Cordya/ZKTeco biometric machine at the shop/office. It constantly listens for attendance logs and pushes them securely to the MaskPro HRIS Production Server in real-time.

## Prerequisites
1. **Node.js**: The mini-PC must have Node.js installed (v18 or higher recommended). Download from [nodejs.org](https://nodejs.org/).
2. **Network Connection**: The mini-PC must be on the **same local network** as the biometric machine, AND it must have internet access to reach `hris.maskpro.ph`.

## Installation Guide

1. Create a folder on the mini-PC (e.g., `C:\MaskPro_Biometrics`).
2. Copy the contents of this `biometric-bridge` folder into it (`index.js`, `package.json`, `.env`).
3. Open a Command Prompt or PowerShell in that folder.
4. Run the installation command:
   ```bash
   npm install
   ```

## Configuration
Edit the `.env` file in the folder:

*   `DEVICE_IP`: The local IP address of the Cordya/ZKTeco machine (e.g., `192.168.1.201`).
*   `DEVICE_PORT`: Usually `4370`.
*   `HRIS_API_URL`: Leave as `https://hris.maskpro.ph/api`.
*   `HRIS_API_KEY`: A secure token we will generate in the HRIS to authorize this script to push data.

## Running the Bridge
To start the bridge manually:
```bash
node index.js
```

### Running as a Background Service (Windows)
To ensure the script runs automatically when the mini-PC turns on:
1. Install PM2 globally: `npm install -g pm2`
2. Start the script: `pm2 start index.js --name "maskpro-biometrics"`
3. Save the process list: `pm2 save`
4. Setup startup script: `pm2 startup` (Follow the instructions printed on the screen).
