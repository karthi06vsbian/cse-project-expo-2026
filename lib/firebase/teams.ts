import { db } from './client';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore';
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

let localMemoryTeams: Team[] = [...FALLBACK_TEAMS];
let localMemoryLogs: WhatsAppLog[] = [];

async function getAdminFirestoreSafe() {
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) return null;
  try {
    const { getAdminFirestore } = await import('./admin');
    return getAdminFirestore();
  } catch {
    return null;
  }
}

export async function getAllFirestoreTeams(): Promise<Team[]> {
  // 1. Try Admin SDK if configured
  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      const snapshot = await adminFirestore.collection('teams').orderBy('submitted_at', 'desc').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Team, 'id'>) }));
      }
    } catch (e) {
      console.warn('[Admin Firestore] Query fallback:', e);
    }
  }

  // 2. Try Web SDK Firestore
  try {
    const teamsCol = collection(db, 'teams');
    const q = query(teamsCol, orderBy('submitted_at', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Team, 'id'>) }));
    }
  } catch (err) {
    console.warn('[Web Firestore] Query fallback, using memory:', err);
  }

  return localMemoryTeams;
}

export async function getTeamByUserId(userId: string): Promise<Team | null> {
  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      const snapshot = await adminFirestore
        .collection('teams')
        .where('submitted_by', '==', userId)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const d = snapshot.docs[0]!;
        return { id: d.id, ...(d.data() as Omit<Team, 'id'>) };
      }
    } catch (e) {}
  }

  try {
    const teamsCol = collection(db, 'teams');
    const q = query(teamsCol, where('submitted_by', '==', userId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0]!;
      return { id: d.id, ...(d.data() as Omit<Team, 'id'>) };
    }
  } catch (err) {}

  return localMemoryTeams.find((t) => t.submitted_by === userId) || null;
}

export async function getTeamByDocId(docId: string): Promise<Team | null> {
  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      const d = await adminFirestore.collection('teams').doc(docId).get();
      if (d.exists) {
        return { id: d.id, ...(d.data() as Omit<Team, 'id'>) };
      }
    } catch (e) {}
  }

  try {
    const docRef = doc(db, 'teams', docId);
    const d = await getDoc(docRef);
    if (d.exists()) {
      return { id: d.id, ...(d.data() as Omit<Team, 'id'>) };
    }
  } catch (err) {}

  return localMemoryTeams.find((t) => t.id === docId) || null;
}

export async function createFirestoreTeam(
  teamData: Omit<Team, 'id' | 'submission_id' | 'submitted_at' | 'updated_at'>
): Promise<Team> {
  const existingTeams = await getAllFirestoreTeams();
  const seqNum = String(existingTeams.length + 1).padStart(4, '0');
  const submission_id = `CSEEXPO-2026-${seqNum}`;
  const now = new Date().toISOString();

  const newTeam: Team = {
    id: `team_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    submission_id,
    ...teamData,
    submitted_at: now,
    updated_at: now,
  };

  // 1. Try Admin SDK
  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      const docRef = await adminFirestore.collection('teams').add({
        submission_id,
        ...teamData,
        submitted_at: now,
        updated_at: now,
      });
      newTeam.id = docRef.id;
      return newTeam;
    } catch (e) {
      console.warn('[Admin Firestore] Add error:', e);
    }
  }

  // 2. Try Web SDK
  try {
    const teamsCol = collection(db, 'teams');
    const docRef = await addDoc(teamsCol, {
      submission_id,
      ...teamData,
      submitted_at: now,
      updated_at: now,
    });
    newTeam.id = docRef.id;
    return newTeam;
  } catch (err) {
    console.warn('[Web Firestore] Add error, saving to memory:', err);
  }

  // 3. Fallback in memory
  localMemoryTeams.unshift(newTeam);
  return newTeam;
}

export async function updateFirestoreTeam(docId: string, updates: Partial<Team>): Promise<boolean> {
  const now = new Date().toISOString();

  // In-memory update
  const idx = localMemoryTeams.findIndex((t) => t.id === docId);
  if (idx !== -1) {
    localMemoryTeams[idx] = { ...localMemoryTeams[idx]!, ...updates, updated_at: now };
  }

  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      await adminFirestore.collection('teams').doc(docId).update({
        ...updates,
        updated_at: now,
      });
      return true;
    } catch (e) {}
  }

  try {
    const docRef = doc(db, 'teams', docId);
    await updateDoc(docRef, { ...updates, updated_at: now });
    return true;
  } catch (err) {}

  return idx !== -1;
}

export async function logFirestoreWhatsAppMessage(
  logData: Omit<WhatsAppLog, 'id' | 'sent_at'>
): Promise<void> {
  const now = new Date().toISOString();
  const newLog: WhatsAppLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    ...logData,
    sent_at: now,
  };

  localMemoryLogs.unshift(newLog);

  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      await adminFirestore.collection('whatsapp_logs').add({
        ...logData,
        sent_at: now,
      });
      return;
    } catch (e) {}
  }

  try {
    const logsCol = collection(db, 'whatsapp_logs');
    await addDoc(logsCol, { ...logData, sent_at: now });
  } catch (err) {}
}

export async function getFirestoreWhatsAppLogs(): Promise<WhatsAppLog[]> {
  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      const snap = await adminFirestore
        .collection('whatsapp_logs')
        .orderBy('sent_at', 'desc')
        .limit(100)
        .get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WhatsAppLog, 'id'>) }));
      }
    } catch (e) {}
  }

  try {
    const logsCol = collection(db, 'whatsapp_logs');
    const q = query(logsCol, orderBy('sent_at', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WhatsAppLog, 'id'>) }));
    }
  } catch (err) {}

  return localMemoryLogs;
}

export const getAllFirestoreWhatsAppLogs = getFirestoreWhatsAppLogs;

export async function deleteFirestoreTeam(docId: string): Promise<boolean> {
  const idx = localMemoryTeams.findIndex((t) => t.id === docId);
  if (idx !== -1) {
    localMemoryTeams.splice(idx, 1);
  }

  const adminFirestore = await getAdminFirestoreSafe();
  if (adminFirestore) {
    try {
      await adminFirestore.collection('teams').doc(docId).delete();
      return true;
    } catch (e) {}
  }

  try {
    const docRef = doc(db, 'teams', docId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {}

  return idx !== -1;
}
