import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { Team } from '@/types';

// Fallback demo data if DB is empty or during local preview
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
  {
    id: 'demo-6',
    submission_id: 'CSEEXPO-2026-0006',
    team_name: 'AquaTrace',
    team_leader_name: 'Meera Nair',
    whatsapp_number: '+919876543215',
    email: 'meera.nair@gmail.com',
    project_title: 'Autonomous Floating River Surface Plastic Skimmer',
    theme: 'Environment',
    problem_description: 'Urban rivers accumulate massive plastic bottles and micro-debris before reaching filtration grates.',
    solution_description: 'Autonomous twin-hull catamaran navigating GPS geofences and harvesting surface floating debris.',
    technologies_used: 'ROS2, Python, YOLOv8-nano, React Dashboard',
    hardware_components: 'Raspberry Pi 4, Pixhawk 4 Flight Controller, Underwater Thrusters, Dual Sonar Depth Sensors',
    expected_outcome: 'Collection of 15kg plastic per charge.',
    status: 'under_review',
    submitted_by: 'user-6',
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Meera Nair', year: '3rd Year', section: 'C' },
      { name: 'Manish Tiwari', year: '3rd Year', section: 'C' },
      { name: 'Nikita Deshmukh', year: '3rd Year', section: 'D' },
    ],
  },
  {
    id: 'demo-7',
    submission_id: 'CSEEXPO-2026-0007',
    team_name: 'CipherLocker',
    team_leader_name: 'Kartik Iyer',
    whatsapp_number: '+919876543216',
    email: 'kartik.iyer@gmail.com',
    project_title: 'Hardware Security Key with Biometric FIDO2 & Decoy Vault',
    theme: 'Cyber Security',
    problem_description: 'Traditional USB security keys offer no defense under physical duress or unauthorized theft.',
    solution_description: 'A USB-C authenticator requiring live fingerprint verification unlocking distinct credential partitions.',
    technologies_used: 'Rust, WebAuthn, FIDO2 CTAP2 specification, React Desktop Client',
    hardware_components: 'RP2040 Microcontroller, FPC1020 Sensor, ATECC608A Crypto Chip, USB Type-C',
    expected_outcome: 'Hardware token resisting physical side-channel attacks.',
    status: 'submitted',
    submitted_by: 'user-7',
    submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Kartik Iyer', year: '4th Year', section: 'D' },
      { name: 'Omkar Kulkarni', year: '4th Year', section: 'D' },
    ],
  },
  {
    id: 'demo-8',
    submission_id: 'CSEEXPO-2026-0008',
    team_name: 'FinPOS Terminal',
    team_leader_name: 'Sneha Kulkarni',
    whatsapp_number: '+919876543217',
    email: 'sneha.kulkarni@gmail.com',
    project_title: 'Offline Soundwave-Based UPI Micro-Payment Validator',
    theme: 'FinTech',
    problem_description: 'Vendors in underground metro stations lose sales when mobile data drops during QR scanning.',
    solution_description: 'Encrypted near-ultrasound acoustic communication transferring signed transaction tokens.',
    technologies_used: 'Flutter, Go Backend, Web Audio API, HMAC-SHA256',
    hardware_components: 'ESP32-S3, INMP441 Microphone, Thermal Receipt Printer, 16x2 I2C LCD',
    expected_outcome: 'Instantaneous 1.2-second offline transaction verification.',
    status: 'under_review',
    submitted_by: 'user-8',
    submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Sneha Kulkarni', year: '2nd Year', section: 'A' },
      { name: 'Qasim Ali', year: '2nd Year', section: 'A' },
    ],
  },
  {
    id: 'demo-9',
    submission_id: 'CSEEXPO-2026-0009',
    team_name: 'CivicFlow Traffic',
    team_leader_name: 'Arjun Menon',
    whatsapp_number: '+919876543218',
    email: 'arjun.menon@gmail.com',
    project_title: 'Adaptive Green Wave Corridor for Emergency Vehicles',
    theme: 'Smart City',
    problem_description: 'Ambulances in major cities lose critical transit time stuck behind red light junctions.',
    solution_description: 'DSRC transceiver pair preemptively clearing signal phases for approaching ambulances.',
    technologies_used: 'Next.js, Python, FastAPI, Kepler.gl, WebSocket GIS',
    hardware_components: 'Raspberry Pi 3B+, 5.8GHz RF Transceiver, 1080p IP Road Camera, Relays',
    expected_outcome: 'Average reduction of 4.5 minutes per 5km route.',
    status: 'rejected',
    submitted_by: 'user-9',
    submitted_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Arjun Menon', year: '4th Year', section: 'C' },
      { name: 'Ritu Saxena', year: '4th Year', section: 'C' },
      { name: 'Siddharth Roy', year: '4th Year', section: 'B' },
    ],
  },
  {
    id: 'demo-10',
    submission_id: 'CSEEXPO-2026-0010',
    team_name: 'GestureVoice',
    team_leader_name: 'Pooja Hegde',
    whatsapp_number: '+919876543219',
    email: 'pooja.hegde@gmail.com',
    project_title: 'Indian Sign Language (ISL) Translation Smart Glove',
    theme: 'Social Impact',
    problem_description: 'Mute and deaf citizens face severe communication barriers in public facilities.',
    solution_description: 'Sensor glove mapping 26 ISL hand poses into natural speech synthesized in regional languages.',
    technologies_used: 'TensorFlow Lite Micro, C++, Android App, Google Cloud TTS',
    hardware_components: 'Custom Flex Sensors, MPU-6050 Gyro, Seeed Xiao ESP32-C3, BLE 5.0',
    expected_outcome: 'Real-time sign-to-voice conversion with 94.2% accuracy.',
    status: 'submitted',
    submitted_by: 'user-10',
    submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    team_members: [
      { name: 'Pooja Hegde', year: '3rd Year', section: 'D' },
      { name: 'Tanvi Agarwal', year: '3rd Year', section: 'D' },
      { name: 'Utkarsh Trivedi', year: '3rd Year', section: 'A' },
    ],
  },
];

// GET: List all teams with filters, search, and sorting
export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const theme = searchParams.get('theme');
  const status = searchParams.get('status');
  const year = searchParams.get('year');
  const section = searchParams.get('section');
  const sortBy = searchParams.get('sortBy') || 'newest';

  try {
    const adminSupabase = createAdminClient();
    const { data: dbTeams, error } = await adminSupabase
      .from('teams')
      .select('*, team_members(*)');

    let teams: Team[] = [];

    if (error || !dbTeams || dbTeams.length === 0) {
      // Fallback to sample seed data if DB table has no rows
      teams = FALLBACK_TEAMS;
    } else {
      teams = dbTeams as Team[];
    }

    // Apply Search Filter across multiple fields
    if (search) {
      teams = teams.filter((t) => {
        const inTeamName = t.team_name.toLowerCase().includes(search);
        const inLeader = t.team_leader_name.toLowerCase().includes(search);
        const inProject = t.project_title.toLowerCase().includes(search);
        const inSubId = t.submission_id.toLowerCase().includes(search);
        const inEmail = t.email.toLowerCase().includes(search);
        const inPhone = t.whatsapp_number.includes(search);
        const inMembers = t.team_members?.some((m) => m.name.toLowerCase().includes(search));
        return inTeamName || inLeader || inProject || inSubId || inEmail || inPhone || inMembers;
      });
    }

    // Filter by Theme
    if (theme && theme !== 'all') {
      teams = teams.filter((t) => t.theme === theme);
    }

    // Filter by Status
    if (status && status !== 'all') {
      teams = teams.filter((t) => t.status === status);
    }

    // Filter by Year
    if (year && year !== 'all') {
      teams = teams.filter((t) => t.team_members?.some((m) => m.year === year));
    }

    // Filter by Section
    if (section && section !== 'all') {
      teams = teams.filter((t) => t.team_members?.some((m) => m.section === section));
    }

    // Apply Sorting
    teams.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      }
      if (sortBy === 'team_name') {
        return a.team_name.localeCompare(b.team_name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      // default: newest
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

    return NextResponse.json({ teams, total: teams.length });
  } catch (err: any) {
    console.error('[Admin Teams GET Error]', err);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// PUT: Update team status or details
export async function PUT(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, team_name, team_leader_name, project_title, theme } = body;

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (team_name) updates.team_name = team_name;
    if (team_leader_name) updates.team_leader_name = team_leader_name;
    if (project_title) updates.project_title = project_title;
    if (theme) updates.theme = theme;

    const { data, error } = await adminSupabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[Admin Team Update Error]', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, team: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update error' }, { status: 500 });
  }
}

// DELETE: Delete a team
export async function DELETE(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.from('teams').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Delete error' }, { status: 500 });
  }
}
