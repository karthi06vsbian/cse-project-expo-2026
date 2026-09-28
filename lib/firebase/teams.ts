import { getAdminFirestore } from './admin';
import { Team, WhatsAppLog, TeamStatus } from '@/types';

// Fallback demo teams for preview if Firestore is not yet connected
const FALLBACK_TEAMS: Team[] = [
  {
    id: 'demo-1',
    submission_id: 'CSEEXPO-2026-0001',
    team_name: 'AgriSense IoT',
    team_leader_name: 'Aarav Sharma',
    whatsapp_number: '+919876543210',
    email: 'aarav.sharma@gmail.com',
    project_title: 'Precision Soil Health & Automated Irrigation System',
    theme: 'Agriculture',
    problem_description: 'Traditional farming leads to 40% water wastage and excessive chemical fertilizer usage due to lack of real-time soil nutrient and moisture data.',
    solution_description: 'An edge-AI enabled smart telemetry system with multi-depth soil probes, automated solenoid irrigation valves, and a React Native dashboard.',
    technologies_used: 'Next.js, Python, Flask, TensorFlow Lite, MQTT, InfluxDB',
    hardware_components: 'ESP32 DevKit, Capacitive Soil Moisture Sensors, NPK Soil Sensor, 12V Solenoid Valves, LoRa Ra-02 Module',
    expected_outcome: '35% water savings and early detection of nutrient deficiencies.',
    status: 'shortlisted',
    submitted_by: 'user-1',
    submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Aarav Sharma', year: '3rd Year', section: 'A' },
      { name: 'Bhavya Gupta', year: '3rd Year', section: 'A' },
      { name: 'Chirag Singhal', year: '3rd Year', section: 'B' },
      { name: 'Deepak Joshi', year: '3rd Year', section: 'A' },
    ],
  },
  {
    id: 'demo-2',
    submission_id: 'CSEEXPO-2026-0002',
    team_name: 'PulseGuard',
    team_leader_name: 'Diya Patel',
    whatsapp_number: '+919876543211',
    email: 'diya.patel@gmail.com',
    project_title: 'Non-Invasive Wearable Cardiac & Hypoxia Alert Band',
    theme: 'Healthcare',
    problem_description: 'Rural patients experiencing arrhythmia and nocturnal hypoxia often face delayed emergency response due to absence of affordable continuous telemetry.',
    solution_description: 'A wristband running lightweight tinyML for anomaly classification in PPG waveform with GSM-assisted SOS beaconing.',
    technologies_used: 'React, FastAPI, Scikit-learn, WebSockets, Supabase',
    hardware_components: 'Raspberry Pi Pico W, MAX30102 PPG Sensor, AD8232 ECG Sensor, SIM800L GSM Module, 0.96 OLED Display',
    expected_outcome: 'Continuous 24-hr vitals monitoring with sub-3 second emergency trigger.',
    status: 'shortlisted',
    submitted_by: 'user-2',
    submitted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Diya Patel', year: '4th Year', section: 'B' },
      { name: 'Eshwar Rao', year: '4th Year', section: 'B' },
      { name: 'Farhan Khan', year: '4th Year', section: 'C' },
    ],
  },
  {
    id: 'demo-3',
    submission_id: 'CSEEXPO-2026-0003',
    team_name: 'NeuroBraille',
    team_leader_name: 'Rohan Verma',
    whatsapp_number: '+919876543212',
    email: 'rohan.verma@gmail.com',
    project_title: 'Dynamic Refreshable Braille Slate with Voice OCR',
    theme: 'Education',
    problem_description: 'Commercial refreshable Braille displays cost upwards of $2,000, rendering them inaccessible to 95% of visually impaired students.',
    solution_description: 'A low-cost 32-cell electromagnetic Braille display combined with an overhead camera that performs optical character recognition.',
    technologies_used: 'Python OpenCV, Tesseract OCR, PyTorch, Node.js API',
    hardware_components: 'STM32 Nucleo Board, 192 Micro-solenoid Actuators, OV5640 Camera Module, Bone-conduction Audio Transducer',
    expected_outcome: 'Affordable dynamic Braille reading device manufactured under INR 4,500.',
    status: 'under_review',
    submitted_by: 'user-3',
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Rohan Verma', year: '2nd Year', section: 'C' },
      { name: 'Gaurav Mehta', year: '2nd Year', section: 'C' },
      { name: 'Harini Swaminathan', year: '2nd Year', section: 'D' },
    ],
  },
  {
    id: 'demo-4',
    submission_id: 'CSEEXPO-2026-0004',
    team_name: 'GreenGrid Micro',
    team_leader_name: 'Ananya Reddy',
    whatsapp_number: '+919876543213',
    email: 'ananya.reddy@gmail.com',
    project_title: 'Autonomous Campus Renewable Microgrid Load Balancer',
    theme: 'Smart Campus',
    problem_description: 'Campuses experience erratic power distribution and waste diesel generator fuel during peak hours.',
    solution_description: 'An intelligent power controller utilizing deep Q-learning to dynamically shift heavy HVAC loads to solar battery banks.',
    technologies_used: 'Next.js, PyTorch, Node-RED, Modbus TCP, TimescaleDB',
    hardware_components: 'Arduino Mega 2560, ACS712 Current Sensors, ZMPT101B Voltage Sensors, Solid State Relays (40A)',
    expected_outcome: '18% reduction in grid electricity consumption.',
    status: 'submitted',
    submitted_by: 'user-4',
    submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Ananya Reddy', year: '4th Year', section: 'A' },
      { name: 'Ishaan Pillai', year: '4th Year', section: 'A' },
    ],
  },
  {
    id: 'demo-5',
    submission_id: 'CSEEXPO-2026-0005',
    team_name: 'SafeStream AI',
    team_leader_name: 'Vikram Singh',
    whatsapp_number: '+919876543214',
    email: 'vikram.singh@gmail.com',
    project_title: 'Vision-Based Industrial Machine Safety Interlock',
    theme: 'Artificial Intelligence',
    problem_description: 'Accidents at mechanical presses occur when operators bypass safety light curtains during shifts.',
    solution_description: 'Stereo-vision edge module tracking operator hands, predicting trajectory, and triggering electronic emergency brakes in 40ms.',
    technologies_used: 'C++, OpenCV, CUDA, TensorRT, Electron Dashboard',
    hardware_components: 'NVIDIA Jetson Orin Nano, Dual Global Shutter CSI Cameras, Optocoupler Relay Isolation Board',
    expected_outcome: 'Zero false negatives in safety hazard classification.',
    status: 'shortlisted',
    submitted_by: 'user-5',
    submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Vikram Singh', year: '3rd Year', section: 'B' },
      { name: 'Jaya Prakash', year: '3rd Year', section: 'B' },
      { name: 'Karan Malhotra', year: '3rd Year', section: 'C' },
    ],
  },
];

// In-memory cache for demo/local storage if Firebase service key isn't provided
let localMemoryTeams: Team[] = [...FALLBACK_TEAMS];
let localMemoryLogs: WhatsAppLog[] = [];

export async function getAllFirestoreTeams(): Promise<Team[]> {
  const firestore = getAdminFirestore();

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return localMemoryTeams;
  }

  try {
    const snapshot = await firestore.collection('teams').orderBy('submitted_at', 'desc').get();
    if (snapshot.empty) {
      return localMemoryTeams;
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Team, 'id'>),
    }));
  } catch (err) {
    console.warn('[Firestore] Error fetching teams, using memory teams:', err);
    return localMemoryTeams;
  }
}

export async function getTeamByUserId(userId: string): Promise<Team | null> {
  const firestore = getAdminFirestore();

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return localMemoryTeams.find((t) => t.submitted_by === userId) || null;
  }

  try {
    const snapshot = await firestore
      .collection('teams')
      .where('submitted_by', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0]!;
    return { id: doc.id, ...(doc.data() as Omit<Team, 'id'>) };
  } catch (err) {
    console.error('[Firestore getTeamByUserId error]', err);
    return localMemoryTeams.find((t) => t.submitted_by === userId) || null;
  }
}

export async function getTeamByDocId(docId: string): Promise<Team | null> {
  const firestore = getAdminFirestore();

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return localMemoryTeams.find((t) => t.id === docId) || null;
  }

  try {
    const doc = await firestore.collection('teams').doc(docId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...(doc.data() as Omit<Team, 'id'>) };
  } catch (err) {
    return localMemoryTeams.find((t) => t.id === docId) || null;
  }
}

export async function createFirestoreTeam(teamData: Omit<Team, 'id' | 'submission_id' | 'submitted_at' | 'updated_at'>): Promise<Team> {
  const firestore = getAdminFirestore();

  // Generate sequence submission ID
  const existingCount = (await getAllFirestoreTeams()).length;
  const seqNum = String(existingCount + 1).padStart(4, '0');
  const submission_id = `CSEEXPO-2026-${seqNum}`;
  const now = new Date().toISOString();

  const newTeam: Team = {
    id: `team_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    submission_id,
    ...teamData,
    submitted_at: now,
    updated_at: now,
  };

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    localMemoryTeams.unshift(newTeam);
    return newTeam;
  }

  try {
    const docRef = await firestore.collection('teams').add({
      submission_id,
      ...teamData,
      submitted_at: now,
      updated_at: now,
    });
    newTeam.id = docRef.id;
    return newTeam;
  } catch (err) {
    console.warn('[Firestore] Error saving team to cloud Firestore, saving in memory:', err);
    localMemoryTeams.unshift(newTeam);
    return newTeam;
  }
}

export async function updateFirestoreTeam(docId: string, updates: Partial<Team>): Promise<boolean> {
  const firestore = getAdminFirestore();
  const now = new Date().toISOString();

  // Update in local memory
  const idx = localMemoryTeams.findIndex((t) => t.id === docId);
  if (idx !== -1) {
    localMemoryTeams[idx] = { ...localMemoryTeams[idx]!, ...updates, updated_at: now };
  }

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return true;
  }

  try {
    await firestore.collection('teams').doc(docId).update({
      ...updates,
      updated_at: now,
    });
    return true;
  } catch (err) {
    console.error('[Firestore update error]', err);
    return false;
  }
}

export async function deleteFirestoreTeam(docId: string): Promise<boolean> {
  localMemoryTeams = localMemoryTeams.filter((t) => t.id !== docId);

  const firestore = getAdminFirestore();
  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return true;
  }

  try {
    await firestore.collection('teams').doc(docId).delete();
    return true;
  } catch (err) {
    return false;
  }
}

export async function logFirestoreWhatsAppMessage(logData: Omit<WhatsAppLog, 'id' | 'sent_at'>): Promise<WhatsAppLog> {
  const now = new Date().toISOString();
  const newLog: WhatsAppLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    ...logData,
    sent_at: now,
  };

  localMemoryLogs.unshift(newLog);

  const firestore = getAdminFirestore();
  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return newLog;
  }

  try {
    const docRef = await firestore.collection('whatsapp_logs').add({
      ...logData,
      sent_at: now,
    });
    newLog.id = docRef.id;
    return newLog;
  } catch (err) {
    return newLog;
  }
}

export async function getAllFirestoreWhatsAppLogs(): Promise<WhatsAppLog[]> {
  const firestore = getAdminFirestore();

  if (!firestore || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return localMemoryLogs;
  }

  try {
    const snapshot = await firestore.collection('whatsapp_logs').orderBy('sent_at', 'desc').get();
    if (snapshot.empty) return localMemoryLogs;
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<WhatsAppLog, 'id'>),
    }));
  } catch (err) {
    return localMemoryLogs;
  }
}
