-- ==============================================================================
-- CSE PROJECT EXPO 2026 — SEED DATA (10 Sample Teams with Members)
-- For Development, Preview & Demonstration Purposes Only
-- ==============================================================================

DO $$
DECLARE
    -- Mock user IDs
    uid_admin UUID := '00000000-0000-0000-0000-000000000001';
    uid_1 UUID := '00000000-0000-0000-0000-000000000011';
    uid_2 UUID := '00000000-0000-0000-0000-000000000012';
    uid_3 UUID := '00000000-0000-0000-0000-000000000013';
    uid_4 UUID := '00000000-0000-0000-0000-000000000014';
    uid_5 UUID := '00000000-0000-0000-0000-000000000015';
    uid_6 UUID := '00000000-0000-0000-0000-000000000016';
    uid_7 UUID := '00000000-0000-0000-0000-000000000017';
    uid_8 UUID := '00000000-0000-0000-0000-000000000018';
    uid_9 UUID := '00000000-0000-0000-0000-000000000019';
    uid_10 UUID := '00000000-0000-0000-0000-000000000020';

    t1_id UUID := gen_random_uuid();
    t2_id UUID := gen_random_uuid();
    t3_id UUID := gen_random_uuid();
    t4_id UUID := gen_random_uuid();
    t5_id UUID := gen_random_uuid();
    t6_id UUID := gen_random_uuid();
    t7_id UUID := gen_random_uuid();
    t8_id UUID := gen_random_uuid();
    t9_id UUID := gen_random_uuid();
    t10_id UUID := gen_random_uuid();
BEGIN
    -- 1. Insert Mock Profiles if not exists
    INSERT INTO public.profiles (id, email, full_name, role) VALUES
    (uid_admin, 'admin@college.edu', 'Prof. K. Venkatesh (Admin)', 'admin'),
    (uid_1, 'aarav.sharma@gmail.com', 'Aarav Sharma', 'student'),
    (uid_2, 'diya.patel@gmail.com', 'Diya Patel', 'student'),
    (uid_3, 'rohan.verma@gmail.com', 'Rohan Verma', 'student'),
    (uid_4, 'ananya.reddy@gmail.com', 'Ananya Reddy', 'student'),
    (uid_5, 'vikram.singh@gmail.com', 'Vikram Singh', 'student'),
    (uid_6, 'meera.nair@gmail.com', 'Meera Nair', 'student'),
    (uid_7, 'kartik.iyer@gmail.com', 'Kartik Iyer', 'student'),
    (uid_8, 'sneha.kulkarni@gmail.com', 'Sneha Kulkarni', 'student'),
    (uid_9, 'arjun.menon@gmail.com', 'Arjun Menon', 'student'),
    (uid_10, 'pooja.hegde@gmail.com', 'Pooja Hegde', 'student')
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insert Teams
    INSERT INTO public.teams (
        id, submission_id, team_name, team_leader_name, whatsapp_number, email, 
        project_title, theme, problem_description, solution_description, 
        technologies_used, hardware_components, expected_outcome, status, submitted_by
    ) VALUES
    (
        t1_id, 'CSEEXPO-2026-0001', 'AgriSense IoT', 'Aarav Sharma', '+919876543210', 'aarav.sharma@gmail.com',
        'Precision Soil Health & Automated Irrigation System', 'Agriculture',
        'Traditional farming leads to 40% water wastage and excessive chemical fertilizer usage due to lack of real-time soil nutrient and moisture data.',
        'An edge-AI enabled smart telemetry system with multi-depth soil probes, automated solenoid irrigation valves, and a React Native dashboard for farmers.',
        'Next.js, Python, Flask, TensorFlow Lite, MQTT, InfluxDB',
        'ESP32 DevKit, Capacitive Soil Moisture Sensors, NPK Soil Sensor, 12V Solenoid Valves, LoRa Ra-02 Module',
        '35% water savings and early detection of nutrient deficiencies with automated Hindi/English SMS and WhatsApp advisories.',
        'shortlisted', uid_1
    ),
    (
        t2_id, 'CSEEXPO-2026-0002', 'PulseGuard', 'Diya Patel', '+919876543211', 'diya.patel@gmail.com',
        'Non-Invasive Wearable Cardiac & Hypoxia Alert Band', 'Healthcare',
        'Rural patients experiencing arrhythmia and nocturnal hypoxia often face delayed emergency response due to absence of affordable continuous telemetry.',
        'A wristband running lightweight tinyML for anomaly classification in PPG waveform with GSM-assisted SOS beaconing.',
        'React, FastAPI, Scikit-learn, WebSockets, Supabase',
        'Raspberry Pi Pico W, MAX30102 PPG Sensor, AD8232 ECG Sensor, SIM800L GSM Module, 0.96 OLED Display',
        'Continuous 24-hr vitals monitoring with sub-3 second emergency trigger to local healthcare centers.',
        'shortlisted', uid_2
    ),
    (
        t3_id, 'CSEEXPO-2026-0003', 'NeuroBraille', 'Rohan Verma', '+919876543212', 'rohan.verma@gmail.com',
        'Dynamic Refreshable Braille Slate with Voice OCR', 'Education',
        'Commercial refreshable Braille displays cost upwards of $2,000, rendering them inaccessible to 95% of visually impaired students in India.',
        'A low-cost 32-cell electromagnetic Braille display combined with an overhead camera that performs optical character recognition on printed textbooks.',
        'Python OpenCV, Tesseract OCR, PyTorch, Node.js API',
        'STM32 Nucleo Board, 192 Micro-solenoid Actuators, OV5640 Camera Module, Bone-conduction Audio Transducer',
        'Affordable dynamic Braille reading device manufactured under INR 4,500 with instant voice narration.',
        'under_review', uid_3
    ),
    (
        t4_id, 'CSEEXPO-2026-0004', 'GreenGrid Micro', 'Ananya Reddy', '+919876543213', 'ananya.reddy@gmail.com',
        'Autonomous Campus Renewable Microgrid Load Balancer', 'Smart Campus',
        'College campuses experience erratic power distribution and waste diesel generator fuel during peak hours without real-time solar tracking and phase balancing.',
        'An intelligent power controller utilizing deep Q-learning to dynamically shift heavy HVAC loads to solar battery banks during peak irradiance.',
        'Next.js, PyTorch, Node-RED, Modbus TCP, TimescaleDB',
        'Arduino Mega 2560, ACS712 Current Sensors, ZMPT101B Voltage Sensors, Solid State Relays (40A), RS485 Interface',
        '18% reduction in grid electricity consumption across CSE laboratory block.',
        'submitted', uid_4
    ),
    (
        t5_id, 'CSEEXPO-2026-0005', 'SafeStream AI', 'Vikram Singh', '+919876543214', 'vikram.singh@gmail.com',
        'Vision-Based Industrial Machine Safety Interlock', 'Artificial Intelligence',
        'Accidents at mechanical presses and CNC workstations occur when operators bypass safety light curtains during shift fatigues.',
        'A stereo-vision edge module that tracks operator hands, predicts trajectory with Kalman filters, and triggers physical electronic emergency brakes within 40ms.',
        'C++, OpenCV, CUDA, TensorRT, Electron Dashboard',
        'NVIDIA Jetson Orin Nano, Dual Global Shutter CSI Cameras, Optocoupler Relay Isolation Board, Industrial Tower Lamp',
        'Zero false negatives in safety hazard classification in benchmark factory tests.',
        'shortlisted', uid_5
    ),
    (
        t6_id, 'CSEEXPO-2026-0006', 'AquaTrace', 'Meera Nair', '+919876543215', 'meera.nair@gmail.com',
        'Autonomous Floating River Surface Plastic Skimmer', 'Environment',
        'Urban rivers and lake inlets accumulate massive plastic bottles and micro-debris before reaching municipal wastewater filtration grates.',
        'An autonomous twin-hull catamaran with onboard object detection that navigates along GPS geofences and harvests surface floating debris.',
        'ROS2, Python, YOLOv8-nano, React Dashboard',
        'Raspberry Pi 4, Pixhawk 4 Flight Controller, Underwater Thrusters, Dual Sonar Depth Sensors, Conveyor DC Motor',
        'Capacity to collect up to 15kg of floating plastic waste per battery charge cycle.',
        'under_review', uid_6
    ),
    (
        t7_id, 'CSEEXPO-2026-0007', 'CipherLocker', 'Kartik Iyer', '+919876543216', 'kartik.iyer@gmail.com',
        'Hardware Security Key with Biometric FIDO2 & Decoy Vault', 'Cyber Security',
        'Phishing attacks easily compromise SMS 2FA, while traditional USB security keys offer no defense under physical duress or unauthorized theft.',
        'A USB-C hardware authenticator requiring live optical fingerprint verification that unlocks distinct credential partitions depending on scanned finger.',
        'Rust, WebAuthn, FIDO2 CTAP2 specification, React Desktop Client',
        'RP2040 Microcontroller, Capacitive Fingerprint Sensor FPC1020, ATECC608A CryptoAuthentication Chip, USB Type-C interface',
        'Cryptographically secure physical token resisting side-channel power analysis attacks.',
        'submitted', uid_7
    ),
    (
        t8_id, 'CSEEXPO-2026-0008', 'FinPOS Terminal', 'Sneha Kulkarni', '+919876543217', 'sneha.kulkarni@gmail.com',
        'Offline Soundwave-Based UPI Micro-Payment Validator', 'FinTech',
        'Vendors in underground metro stations and remote rural haats lose sales when mobile internet connectivity drops during UPI QR code scanning.',
        'Encrypted near-ultrasound acoustic communication that transfers signed transaction tokens between smartphone speaker and micro-terminal.',
        'Flutter, Go Backend, Web Audio API, HMAC-SHA256',
        'ESP32-S3, I2S MEMS Microphone INMP441, Thermal Receipt Printer, 16x2 I2C Character LCD, Li-Ion BMS',
        'Instantaneous 1.2-second offline transaction verification without cellular data.',
        'under_review', uid_8
    ),
    (
        t9_id, 'CSEEXPO-2026-0009', 'CivicFlow Traffic', 'Arjun Menon', '+919876543218', 'arjun.menon@gmail.com',
        'Adaptive Green Wave Corridor for Emergency Vehicles', 'Smart City',
        'Ambulances in tier-1 Indian cities lose critical golden-hour transit time stuck behind congested red light junctions.',
        'A DSRC (Dedicated Short-Range Communication) transceiver pair with visual license validation that preemptively clears signal phases for approaching ambulances.',
        'Next.js, Python, FastAPI, Kepler.gl, WebSocket GIS',
        'Raspberry Pi 3B+, 5.8GHz RF Transceiver, 1080p IP Road Camera, Solid State Traffic Signal Switching Relay Pack',
        'Average reduction of 4.5 minutes per 5-kilometer emergency ambulance route.',
        'rejected', uid_9
    ),
    (
        t10_id, 'CSEEXPO-2026-0010', 'GestureVoice', 'Pooja Hegde', '+919876543219', 'pooja.hegde@gmail.com',
        'Indian Sign Language (ISL) Translation Smart Glove', 'Social Impact',
        'Speech and hearing impaired individuals face severe communication barriers in public offices, banks, and healthcare institutions.',
        'A lightweight sensor glove mapping 26 ISL hand poses into natural speech synthesized in regional languages (Telugu, Kannada, Hindi).',
        'TensorFlow Lite Micro, C++, Android App, Google Cloud TTS',
        'Custom Flex Sensors, MPU-6050 6-Axis Gyro/Accelerometer, Seeed Xiao ESP32-C3, Micro Bluetooth BLE 5.0, Haptic Vibration Motor',
        'Real-time sign-to-voice conversion with 94.2% accuracy across 50 everyday phrases.',
        'submitted', uid_10
    );

    -- 3. Insert Team Members (2 to 4 members each)
    INSERT INTO public.team_members (team_id, name, year, section) VALUES
    -- Team 1
    (t1_id, 'Aarav Sharma', '3rd Year', 'A'),
    (t1_id, 'Bhavya Gupta', '3rd Year', 'A'),
    (t1_id, 'Chirag Singhal', '3rd Year', 'B'),
    (t1_id, 'Deepak Joshi', '3rd Year', 'A'),

    -- Team 2
    (t2_id, 'Diya Patel', '4th Year', 'B'),
    (t2_id, 'Eshwar Rao', '4th Year', 'B'),
    (t2_id, 'Farhan Khan', '4th Year', 'C'),

    -- Team 3
    (t3_id, 'Rohan Verma', '2nd Year', 'C'),
    (t3_id, 'Gaurav Mehta', '2nd Year', 'C'),
    (t3_id, 'Harini Swaminathan', '2nd Year', 'D'),

    -- Team 4
    (t4_id, 'Ananya Reddy', '4th Year', 'A'),
    (t4_id, 'Ishaan Pillai', '4th Year', 'A'),

    -- Team 5
    (t5_id, 'Vikram Singh', '3rd Year', 'B'),
    (t5_id, 'Jaya Prakash', '3rd Year', 'B'),
    (t5_id, 'Karan Malhotra', '3rd Year', 'C'),
    (t5_id, 'Lavanya Sen', '3rd Year', 'B'),

    -- Team 6
    (t6_id, 'Meera Nair', '3rd Year', 'C'),
    (t6_id, 'Manish Tiwari', '3rd Year', 'C'),
    (t6_id, 'Nikita Deshmukh', '3rd Year', 'D'),

    -- Team 7
    (t7_id, 'Kartik Iyer', '4th Year', 'D'),
    (t7_id, 'Omkar Kulkarni', '4th Year', 'D'),
    (t7_id, 'Pranav Bhat', '4th Year', 'C'),

    -- Team 8
    (t8_id, 'Sneha Kulkarni', '2nd Year', 'A'),
    (t8_id, 'Qasim Ali', '2nd Year', 'A'),

    -- Team 9
    (t9_id, 'Arjun Menon', '4th Year', 'C'),
    (t9_id, 'Ritu Saxena', '4th Year', 'C'),
    (t9_id, 'Siddharth Roy', '4th Year', 'B'),

    -- Team 10
    (t10_id, 'Pooja Hegde', '3rd Year', 'D'),
    (t10_id, 'Tanvi Agarwal', '3rd Year', 'D'),
    (t10_id, 'Utkarsh Trivedi', '3rd Year', 'A');

    -- 4. Insert Sample WhatsApp Logs
    INSERT INTO public.whatsapp_logs (team_id, phone_number, message_type, message_status, provider_message_id, sent_at) VALUES
    (t1_id, '+919876543210', 'submission_confirmation', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzFDQkUxOTk3QTk2', now() - interval '3 days'),
    (t1_id, '+919876543210', 'shortlisted', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzFDQkUxOTk3QUE5', now() - interval '1 day'),
    (t2_id, '+919876543211', 'submission_confirmation', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjExFQIAERgSMzFDQkUxOTk3QUJB', now() - interval '4 days'),
    (t2_id, '+919876543211', 'shortlisted', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjExFQIAERgSMzFDQkUxOTk3QUJD', now() - interval '1 day'),
    (t5_id, '+919876543214', 'submission_confirmation', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjE0FQIAERgSMzFDQkUxOTk3QUJE', now() - interval '2 days'),
    (t5_id, '+919876543214', 'shortlisted', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjE0FQIAERgSMzFDQkUxOTk3QUJF', now() - interval '12 hours'),
    (t9_id, '+919876543218', 'submission_confirmation', 'sent', 'wamid.HBgMOTE5ODc2NTQzMjE4FQIAERgSMzFDQkUxOTk3QUJG', now() - interval '5 days');

END $$;
