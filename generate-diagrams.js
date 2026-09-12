const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'diagram-bab-3');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Use Case Diagram
function createUseCaseSvg() {
    return `<svg width="1000" height="720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #003366; }
      .box-title { font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #1E293B; }
      .actor-label { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #0F172A; text-anchor: middle; }
      .uc-text { font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; fill: #002244; text-anchor: middle; }
      .tag-text { font-family: Arial, sans-serif; font-size: 10px; font-style: italic; fill: #475569; text-anchor: middle; }
      .line { stroke: #334155; stroke-width: 1.5; }
      .dash-line { stroke: #0284C7; stroke-width: 1.5; stroke-dasharray: 5,4; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284C7"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- System Boundary Box -->
  <rect x="220" y="30" width="560" height="660" rx="12" fill="#F8FAFC" stroke="#003366" stroke-width="2.5"/>
  <rect x="220" y="30" width="560" height="40" rx="12" fill="#003366"/>
  <rect x="220" y="55" width="560" height="15" fill="#003366"/>
  <text x="500" y="55" class="title" fill="#FFFFFF" text-anchor="middle">Sistem E-Absensi Pegawai Berbasis Geofencing</text>

  <!-- Actor Karyawan (Left) -->
  <g transform="translate(100, 300)">
    <circle cx="0" cy="-35" r="18" fill="#FFFFFF" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="-17" x2="0" y2="30" stroke="#003366" stroke-width="2.5"/>
    <line x1="-28" y1="-2" x2="28" y2="-2" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="30" x2="-22" y2="70" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="30" x2="22" y2="70" stroke="#003366" stroke-width="2.5"/>
    <text x="0" y="95" class="actor-label">Karyawan</text>
  </g>

  <!-- Actor Administrator (Right) -->
  <g transform="translate(900, 300)">
    <circle cx="0" cy="-35" r="18" fill="#FFFFFF" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="-17" x2="0" y2="30" stroke="#003366" stroke-width="2.5"/>
    <line x1="-28" y1="-2" x2="28" y2="-2" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="30" x2="-22" y2="70" stroke="#003366" stroke-width="2.5"/>
    <line x1="0" y1="30" x2="22" y2="70" stroke="#003366" stroke-width="2.5"/>
    <text x="0" y="95" class="actor-label">Administrator (HRD)</text>
  </g>

  <!-- Use Cases (Ellipses) -->
  <g transform="translate(500, 100)">
    <ellipse cx="0" cy="0" rx="130" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-01: Otentikasi (Login / Logout)</text>
  </g>

  <g transform="translate(370, 175)">
    <ellipse cx="0" cy="0" rx="120" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-02: Presensi Masuk (Clock-In)</text>
  </g>

  <g transform="translate(500, 245)">
    <ellipse cx="0" cy="0" rx="135" ry="26" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
    <text x="0" y="-3" class="uc-text" fill="#92400E">UC-03: Validasi Jarak Geofencing</text>
    <text x="0" y="13" class="tag-text">(Rumus Haversine)</text>
  </g>

  <g transform="translate(370, 315)">
    <ellipse cx="0" cy="0" rx="120" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-04: Presensi Pulang (Clock-Out)</text>
  </g>

  <g transform="translate(370, 385)">
    <ellipse cx="0" cy="0" rx="120" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-05: Lihat Riwayat Presensi</text>
  </g>

  <g transform="translate(370, 455)">
    <ellipse cx="0" cy="0" rx="120" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-06: Mengajukan Cuti Mandiri</text>
  </g>

  <g transform="translate(370, 525)">
    <ellipse cx="0" cy="0" rx="120" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-07: Mengelola Profil Pribadi</text>
  </g>

  <g transform="translate(630, 315)">
    <ellipse cx="0" cy="0" rx="125" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-08: Pantau Statistik Dashboard</text>
  </g>

  <g transform="translate(630, 385)">
    <ellipse cx="0" cy="0" rx="125" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-09: Manajemen Karyawan (CRUD)</text>
  </g>

  <g transform="translate(630, 455)">
    <ellipse cx="0" cy="0" rx="125" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-10: Filter Laporan Kehadiran</text>
  </g>

  <g transform="translate(630, 525)">
    <ellipse cx="0" cy="0" rx="125" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-11: Persetujuan / Penolakan Cuti</text>
  </g>

  <g transform="translate(500, 610)">
    <ellipse cx="0" cy="0" rx="135" ry="24" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
    <text x="0" y="5" class="uc-text">UC-12: Pengaturan GPS Kantor &amp; Leaflet</text>
  </g>

  <!-- Associations -->
  <line x1="120" y1="280" x2="370" y2="100" class="line"/>
  <line x1="120" y1="290" x2="250" y2="175" class="line"/>
  <line x1="120" y1="310" x2="250" y2="315" class="line"/>
  <line x1="120" y1="320" x2="250" y2="385" class="line"/>
  <line x1="120" y1="330" x2="250" y2="455" class="line"/>
  <line x1="120" y1="340" x2="250" y2="525" class="line"/>

  <line x1="880" y1="280" x2="630" y2="100" class="line"/>
  <line x1="880" y1="310" x2="755" y2="315" class="line"/>
  <line x1="880" y1="320" x2="755" y2="385" class="line"/>
  <line x1="880" y1="330" x2="755" y2="455" class="line"/>
  <line x1="880" y1="340" x2="755" y2="525" class="line"/>
  <line x1="880" y1="360" x2="635" y2="610" class="line"/>

  <path d="M 430 195 L 470 225" class="dash-line" marker-end="url(#arrow)"/>
  <text x="475" y="200" class="tag-text">&lt;&lt;include&gt;&gt;</text>

  <path d="M 430 295 L 470 265" class="dash-line" marker-end="url(#arrow)"/>
  <text x="475" y="290" class="tag-text">&lt;&lt;include&gt;&gt;</text>
</svg>`;
}

// 2. Activity Diagram Presensi Geofencing
function createActivityPresensiSvg() {
    return `<svg width="1000" height="880" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .header-title { font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
      .node-text { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #0F172A; text-anchor: middle; }
      .node-bold { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #003366; text-anchor: middle; }
      .decision-text { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #B45309; text-anchor: middle; }
      .branch-label { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #DC2626; }
      .branch-yes { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #16A34A; }
      .line { stroke: #334155; stroke-width: 1.6; fill: none; }
    </style>
    <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- Swimlane Headers -->
  <rect x="40" y="20" width="225" height="40" fill="#003366"/>
  <text x="152" y="45" class="header-title">Karyawan</text>
  <rect x="40" y="60" width="225" height="800" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>

  <rect x="265" y="20" width="235" height="40" fill="#0284C7"/>
  <text x="382" y="45" class="header-title">Browser / Client UI</text>
  <rect x="265" y="60" width="235" height="800" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>

  <rect x="500" y="20" width="250" height="40" fill="#0F766E"/>
  <text x="625" y="45" class="header-title">Server Actions (Backend)</text>
  <rect x="500" y="60" width="250" height="800" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>

  <rect x="750" y="20" width="210" height="40" fill="#334155"/>
  <text x="855" y="45" class="header-title">Database (PostgreSQL)</text>
  <rect x="750" y="60" width="210" height="800" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>

  <!-- Start Node -->
  <circle cx="152" cy="100" r="14" fill="#003366"/>

  <line x1="152" y1="114" x2="152" y2="150" class="line" marker-end="url(#arr)"/>
  <rect x="65" y="150" width="175" height="50" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="1.8"/>
  <text x="152" y="172" class="node-text">Buka Layar Beranda</text>
  <text x="152" y="188" class="node-bold">&amp; Klik Tombol Clock In</text>

  <path d="M 240 175 L 305 175" class="line" marker-end="url(#arr)"/>
  <rect x="285" y="150" width="195" height="50" rx="8" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.8"/>
  <text x="382" y="172" class="node-text">Panggil Geolocation API</text>
  <text x="382" y="188" class="node-bold">(Minta Izin GPS Perangkat)</text>

  <line x1="382" y1="200" x2="382" y2="240" class="line" marker-end="url(#arr)"/>
  <polygon points="382,240 432,270 382,300 332,270" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="382" y="274" class="decision-text">GPS Aktif?</text>

  <path d="M 332 270 L 290 270 L 290 330" class="line" marker-end="url(#arr)"/>
  <text x="300" y="262" class="branch-label">[Tidak]</text>
  <rect x="275" y="330" width="120" height="45" rx="6" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/>
  <text x="335" y="350" class="node-text" fill="#991B1B">Tampilkan Error:</text>
  <text x="335" y="365" class="node-text" fill="#991B1B">GPS Ditolak</text>

  <circle cx="335" cy="415" r="14" fill="#EF4444"/>
  <circle cx="335" cy="415" r="9" fill="#FFFFFF"/>
  <circle cx="335" cy="415" r="6" fill="#EF4444"/>
  <line x1="335" y1="375" x2="335" y2="401" class="line" marker-end="url(#arr)"/>

  <line x1="382" y1="300" x2="382" y2="340" class="line" marker-end="url(#arr)"/>
  <text x="388" y="320" class="branch-yes">[Ya]</text>
  <rect x="285" y="340" width="195" height="50" rx="8" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.8"/>
  <text x="382" y="362" class="node-text">Tangkap Koordinat (lat, lng)</text>
  <text x="382" y="378" class="node-bold">&amp; Panggil clockIn(lat, lng)</text>

  <path d="M 480 365 L 530 365" class="line" marker-end="url(#arr)"/>
  <rect x="530" y="340" width="190" height="50" rx="8" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.8"/>
  <text x="625" y="362" class="node-text">Verifikasi Token Sesi User</text>
  <text x="625" y="378" class="node-bold">&amp; Query Lokasi Kantor</text>

  <path d="M 720 365 L 775 365" class="line" marker-end="url(#arr)"/>
  <rect x="775" y="340" width="160" height="50" rx="8" fill="#F8FAFC" stroke="#334155" stroke-width="1.8"/>
  <text x="855" y="362" class="node-text">Tabel settings:</text>
  <text x="855" y="378" class="node-bold">office_config (lat, lng, r)</text>

  <path d="M 855 390 L 855 435 L 720 435" class="line" marker-end="url(#arr)"/>
  
  <rect x="530" y="415" width="190" height="50" rx="8" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.8"/>
  <text x="625" y="435" class="node-text">Hitung Rumus Haversine:</text>
  <text x="625" y="452" class="node-bold">Jarak d (meter)</text>

  <line x1="625" y1="465" x2="625" y2="505" class="line" marker-end="url(#arr)"/>
  <polygon points="625,505 680,535 625,565 570,535" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="625" y="539" class="decision-text">d &lt;= Radius?</text>

  <path d="M 570 535 L 450 535 L 450 580" class="line" marker-end="url(#arr)"/>
  <text x="490" y="525" class="branch-label">[Tidak / Luar]</text>
  <rect x="375" y="580" width="150" height="50" rx="8" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/>
  <text x="450" y="602" class="node-text" fill="#991B1B">Kembalikan Error:</text>
  <text x="450" y="618" class="node-bold" fill="#991B1B">Di Luar Jangkauan</text>

  <circle cx="450" cy="670" r="14" fill="#EF4444"/>
  <circle cx="450" cy="670" r="9" fill="#FFFFFF"/>
  <circle cx="450" cy="670" r="6" fill="#EF4444"/>
  <line x1="450" y1="630" x2="450" y2="656" class="line" marker-end="url(#arr)"/>

  <line x1="625" y1="565" x2="625" y2="605" class="line" marker-end="url(#arr)"/>
  <text x="632" y="585" class="branch-yes">[Ya / Masuk]</text>
  <polygon points="625,605 680,635 625,665 570,635" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="625" y="639" class="decision-text">Sudah Absen?</text>

  <path d="M 570 635 L 530 635 L 530 700" class="line" marker-end="url(#arr)"/>
  <text x="535" y="625" class="branch-label">[Ya]</text>
  <rect x="460" y="700" width="140" height="40" rx="6" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/>
  <text x="530" y="725" class="node-text" fill="#991B1B">Sudah Absen Hari Ini</text>
  <circle cx="530" cy="775" r="14" fill="#EF4444"/>
  <circle cx="530" cy="775" r="9" fill="#FFFFFF"/>
  <circle cx="530" cy="775" r="6" fill="#EF4444"/>
  <line x1="530" y1="740" x2="530" y2="761" class="line" marker-end="url(#arr)"/>

  <path d="M 680 635 L 775 635" class="line" marker-end="url(#arr)"/>
  <text x="700" y="625" class="branch-yes">[Belum]</text>
  <rect x="775" y="610" width="160" height="50" rx="8" fill="#F8FAFC" stroke="#334155" stroke-width="1.8"/>
  <text x="855" y="632" class="node-text">Tabel attendance:</text>
  <text x="855" y="648" class="node-bold">Insert Presensi Masuk</text>

  <path d="M 855 660 L 855 725 L 382 725" class="line" marker-end="url(#arr)"/>
  <rect x="285" y="700" width="195" height="50" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.8"/>
  <text x="382" y="722" class="node-bold" fill="#15803D">Tampilkan Notifikasi Sukses</text>
  <text x="382" y="738" class="node-text" fill="#15803D">&amp; Ubah Tombol ke Clock Out</text>

  <path d="M 285 725 L 152 725 L 152 765" class="line" marker-end="url(#arr)"/>
  <rect x="65" y="765" width="175" height="40" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="1.8"/>
  <text x="152" y="790" class="node-bold">Status Hadir Hari Ini</text>

  <circle cx="152" cy="835" r="14" fill="#003366"/>
  <circle cx="152" cy="835" r="9" fill="#FFFFFF"/>
  <circle cx="152" cy="835" r="6" fill="#003366"/>
  <line x1="152" y1="805" x2="152" y2="821" class="line" marker-end="url(#arr)"/>
</svg>`;
}

// 3. Activity Diagram Pengajuan dan Persetujuan Cuti
function createActivityCutiSvg() {
    return `<svg width="960" height="760" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .header-title { font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
      .node-text { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #0F172A; text-anchor: middle; }
      .node-bold { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #003366; text-anchor: middle; }
      .decision-text { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #B45309; text-anchor: middle; }
      .branch-label { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #DC2626; }
      .branch-yes { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #16A34A; }
      .line { stroke: #334155; stroke-width: 1.6; fill: none; }
    </style>
    <marker id="arr2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- Swimlane Headers -->
  <rect x="40" y="20" width="280" height="40" fill="#003366"/>
  <text x="180" y="45" class="header-title">Karyawan (Pemohon)</text>
  <rect x="40" y="60" width="280" height="680" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>

  <rect x="320" y="20" width="340" height="40" fill="#0284C7"/>
  <text x="490" y="45" class="header-title">Sistem E-Absensi (Backend &amp; DB)</text>
  <rect x="320" y="60" width="340" height="680" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>

  <rect x="660" y="20" width="260" height="40" fill="#334155"/>
  <text x="790" y="45" class="header-title">Administrator (HRD)</text>
  <rect x="660" y="60" width="260" height="680" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>

  <!-- Start Node -->
  <circle cx="180" cy="100" r="14" fill="#003366"/>

  <line x1="180" y1="114" x2="180" y2="150" class="line" marker-end="url(#arr2)"/>
  <rect x="80" y="150" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="1.8"/>
  <text x="180" y="172" class="node-text">Buka Menu Pengajuan Cuti</text>
  <text x="180" y="188" class="node-bold">&amp; Isi Form (Tipe, Tanggal, Alasan)</text>

  <line x1="180" y1="200" x2="180" y2="240" class="line" marker-end="url(#arr2)"/>
  <rect x="80" y="240" width="200" height="45" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="1.8"/>
  <text x="180" y="267" class="node-bold">Klik "Ajukan Cuti Mandiri"</text>

  <!-- Pass to System -->
  <path d="M 280 262 L 380 262" class="line" marker-end="url(#arr2)"/>
  <polygon points="490,240 560,265 490,290 420,265" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="490" y="269" class="decision-text">Tanggal Valid?</text>

  <!-- Invalid dates -> Return back to Karyawan -->
  <path d="M 420 265 L 350 265 L 350 175 L 280 175" class="line" marker-end="url(#arr2)"/>
  <text x="355" y="220" class="branch-label">[Tidak / Salah]</text>

  <!-- Valid dates -> Save with Pending Status -->
  <line x1="490" y1="290" x2="490" y2="330" class="line" marker-end="url(#arr2)"/>
  <text x="500" y="310" class="branch-yes">[Ya]</text>
  <rect x="380" y="330" width="220" height="50" rx="8" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.8"/>
  <text x="490" y="352" class="node-text">Simpan ke Tabel leaves:</text>
  <text x="490" y="368" class="node-bold">Status: 'pending'</text>

  <!-- Pass to Admin -->
  <path d="M 600 355 L 700 355" class="line" marker-end="url(#arr2)"/>
  <rect x="700" y="330" width="180" height="50" rx="8" fill="#FFFFFF" stroke="#334155" stroke-width="1.8"/>
  <text x="790" y="352" class="node-text">Buka Persetujuan Cuti</text>
  <text x="790" y="368" class="node-bold">&amp; Tinjau Permohonan Staf</text>

  <line x1="790" y1="380" x2="790" y2="420" class="line" marker-end="url(#arr2)"/>
  <polygon points="790,420 860,450 790,480 720,450" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="790" y="454" class="decision-text">Keputusan?</text>

  <!-- Approve Branch -->
  <path d="M 720 450 L 630 450 L 630 490" class="line" marker-end="url(#arr2)"/>
  <text x="640" y="440" class="branch-yes">[Setujui]</text>
  <rect x="540" y="490" width="180" height="45" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.8"/>
  <text x="630" y="512" class="node-bold" fill="#15803D">Update Status:</text>
  <text x="630" y="526" class="node-text" fill="#15803D">'approved'</text>

  <!-- Reject Branch -->
  <path d="M 860 450 L 890 450 L 890 490 L 760 490" class="line" marker-end="url(#arr2)"/>
  <text x="865" y="440" class="branch-label">[Tolak]</text>
  <rect x="720" y="490" width="150" height="45" rx="8" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.8"/>
  <text x="795" y="512" class="node-bold" fill="#991B1B">Update Status:</text>
  <text x="795" y="526" class="node-text" fill="#991B1B">'rejected'</text>

  <!-- Sync to DB -->
  <path d="M 630 535 L 630 580 L 490 580" class="line" marker-end="url(#arr2)"/>
  <path d="M 795 535 L 795 580 L 490 580" class="line"/>

  <rect x="380" y="560" width="220" height="45" rx="8" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.8"/>
  <text x="490" y="582" class="node-text">Sinkronisasi Database</text>
  <text x="490" y="596" class="node-bold">&amp; Kirim Notifikasi Real-time</text>

  <!-- Notify Karyawan -->
  <path d="M 380 582 L 180 582 L 180 620" class="line" marker-end="url(#arr2)"/>
  <rect x="80" y="620" width="200" height="45" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="1.8"/>
  <text x="180" y="642" class="node-text">Menerima Pembaruan Status</text>
  <text x="180" y="656" class="node-bold">(Disetujui / Ditolak)</text>

  <circle cx="180" cy="700" r="14" fill="#003366"/>
  <circle cx="180" cy="700" r="9" fill="#FFFFFF"/>
  <circle cx="180" cy="700" r="6" fill="#003366"/>
  <line x1="180" y1="665" x2="180" y2="686" class="line" marker-end="url(#arr2)"/>
</svg>`;
}

// 4. Sequence Diagram Presensi Clock-In
function createSequenceDiagramSvg() {
    return `<svg width="1020" height="740" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .actor-title { font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
      .msg-text { font-family: Arial, sans-serif; font-size: 11px; font-weight: 600; fill: #003366; }
      .ret-text { font-family: Arial, sans-serif; font-size: 11px; font-style: italic; fill: #0284C7; }
      .lifeline { stroke: #64748B; stroke-width: 1.5; stroke-dasharray: 6,4; }
      .msg-line { stroke: #003366; stroke-width: 1.6; fill: none; }
      .ret-line { stroke: #0284C7; stroke-width: 1.5; stroke-dasharray: 5,3; fill: none; }
      .act-box { fill: #EBF3FA; stroke: #003366; stroke-width: 1.5; }
    </style>
    <marker id="marr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#003366"/>
    </marker>
    <marker id="mret" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- Title Banner -->
  <rect x="50" y="20" width="920" height="40" rx="8" fill="#003366"/>
  <text x="510" y="45" font-family="Arial" font-size="16px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Sequence Diagram Proses Presensi Masuk (Clock-In) dengan Validasi Geofencing</text>

  <!-- Objects (6 Lifelines) -->
  <!-- 1. Karyawan -->
  <rect x="50" y="80" width="130" height="45" rx="6" fill="#003366"/>
  <text x="115" y="107" class="actor-title">:Karyawan</text>
  <line x1="115" y1="125" x2="115" y2="700" class="lifeline"/>

  <!-- 2. UI Client -->
  <rect x="210" y="80" width="140" height="45" rx="6" fill="#0284C7"/>
  <text x="280" y="107" class="actor-title">:AttendanceCard (UI)</text>
  <line x1="280" y1="125" x2="280" y2="700" class="lifeline"/>

  <!-- 3. Geolocation API -->
  <rect x="380" y="80" width="145" height="45" rx="6" fill="#475569"/>
  <text x="452" y="107" class="actor-title">:Browser Geolocation</text>
  <line x1="452" y1="125" x2="452" y2="700" class="lifeline"/>

  <!-- 4. Server Action -->
  <rect x="555" y="80" width="140" height="45" rx="6" fill="#0F766E"/>
  <text x="625" y="107" class="actor-title">:clockIn() Action</text>
  <line x1="625" y1="125" x2="625" y2="700" class="lifeline"/>

  <!-- 5. Haversine Helper -->
  <rect x="725" y="80" width="130" height="45" rx="6" fill="#D97706"/>
  <text x="790" y="107" class="actor-title">:Haversine Engine</text>
  <line x1="790" y1="125" x2="790" y2="700" class="lifeline"/>

  <!-- 6. Database -->
  <rect x="885" y="80" width="115" height="45" rx="6" fill="#1E293B"/>
  <text x="942" y="107" class="actor-title">:PostgreSQL DB</text>
  <line x1="942" y1="125" x2="942" y2="700" class="lifeline"/>

  <!-- Activation Boxes -->
  <rect x="108" y="145" width="14" height="520" class="act-box"/>
  <rect x="273" y="155" width="14" height="500" class="act-box"/>
  <rect x="445" y="180" width="14" height="75" class="act-box"/>
  <rect x="618" y="275" width="14" height="340" class="act-box"/>
  <rect x="783" y="380" width="14" height="60" class="act-box"/>
  <rect x="935" y="320" width="14" height="50" class="act-box"/>
  <rect x="935" y="500" width="14" height="60" class="act-box"/>

  <!-- Messages -->
  <!-- 1. Klik Clock In -->
  <line x1="122" y1="160" x2="273" y2="160" class="msg-line" marker-end="url(#marr)"/>
  <text x="140" y="152" class="msg-text">1: Klik Tombol "Clock In"</text>

  <!-- 2. Get GPS -->
  <line x1="287" y1="185" x2="445" y2="185" class="msg-line" marker-end="url(#marr)"/>
  <text x="300" y="177" class="msg-text">2: getCurrentPosition()</text>

  <!-- 3. Return Coordinates -->
  <line x1="445" y1="245" x2="287" y2="245" class="ret-line" marker-end="url(#mret)"/>
  <text x="315" y="238" class="ret-text">3: coords (lat, lng)</text>

  <!-- 4. Call Server Action -->
  <line x1="287" y1="280" x2="618" y2="280" class="msg-line" marker-end="url(#marr)"/>
  <text x="360" y="272" class="msg-text">4: clockIn(lat, lng)</text>

  <!-- 5. Query Settings DB -->
  <line x1="632" y1="325" x2="935" y2="325" class="msg-line" marker-end="url(#marr)"/>
  <text x="690" y="317" class="msg-text">5: getOfficeConfig()</text>

  <!-- 6. Return Settings -->
  <line x1="935" y1="360" x2="632" y2="360" class="ret-line" marker-end="url(#mret)"/>
  <text x="730" y="352" class="ret-text">6: {lat_kantor, lng_kantor, radius}</text>

  <!-- 7. Calculate Haversine -->
  <line x1="632" y1="390" x2="783" y2="390" class="msg-line" marker-end="url(#marr)"/>
  <text x="645" y="382" class="msg-text">7: calculateDistance(lat1, lon1, lat2, lon2)</text>

  <!-- 8. Return Distance -->
  <line x1="783" y1="430" x2="632" y2="430" class="ret-line" marker-end="url(#mret)"/>
  <text x="670" y="422" class="ret-text">8: Jarak d (meter)</text>

  <!-- Note: Verification -->
  <rect x="575" y="450" width="100" height="30" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
  <text x="625" y="468" font-family="Arial" font-size="10px" font-weight="bold" fill="#B45309" text-anchor="middle">[ d &lt;= radius ]</text>

  <!-- 9. Insert DB -->
  <line x1="632" y1="510" x2="935" y2="510" class="msg-line" marker-end="url(#marr)"/>
  <text x="685" y="502" class="msg-text">9: db.insert(attendances).values({...})</text>

  <!-- 10. DB Confirm -->
  <line x1="935" y1="550" x2="632" y2="550" class="ret-line" marker-end="url(#mret)"/>
  <text x="740" y="542" class="ret-text">10: Record Saved</text>

  <!-- 11. Return Action to UI -->
  <line x1="618" y1="600" x2="287" y2="600" class="ret-line" marker-end="url(#mret)"/>
  <text x="380" y="592" class="ret-text">11: { success: true, message: "Berhasil Absen!" }</text>

  <!-- 12. Update UI & Feedback -->
  <line x1="273" y1="640" x2="122" y2="640" class="msg-line" marker-end="url(#marr)"/>
  <text x="135" y="632" class="msg-text">12: Tampilkan Toast Sukses &amp; Ubah Tombol Clock Out</text>
</svg>`;
}

// 5. Flowchart Geofencing Haversine
function createFlowchartSvg() {
    return `<svg width="760" height="920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .flow-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
      .flow-text { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #0F172A; text-anchor: middle; }
      .flow-bold { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #003366; text-anchor: middle; }
      .flow-decision { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #B45309; text-anchor: middle; }
      .flow-err { font-family: Arial, sans-serif; font-size: 11px; font-weight: 600; fill: #991B1B; text-anchor: middle; }
      .flow-suc { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #15803D; text-anchor: middle; }
      .line { stroke: #334155; stroke-width: 1.8; fill: none; }
      .lbl-yes { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #16A34A; }
      .lbl-no { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #DC2626; }
    </style>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <rect x="60" y="20" width="640" height="40" rx="8" fill="#003366"/>
  <text x="380" y="45" class="flow-title">Flowchart Algoritma Validasi Geofencing Presensi (Rumus Haversine)</text>

  <rect x="290" y="85" width="180" height="40" rx="20" fill="#003366" stroke="#002244" stroke-width="2"/>
  <text x="380" y="110" class="flow-title" font-size="14px">Mulai (Start)</text>

  <line x1="380" y1="125" x2="380" y2="155" class="line" marker-end="url(#arrowhead)"/>

  <polygon points="260,155 490,155 470,195 240,195" fill="#EBF3FA" stroke="#003366" stroke-width="1.8"/>
  <text x="365" y="180" class="flow-bold">Pengguna Mengklik Tombol "Clock In"</text>

  <line x1="365" y1="195" x2="365" y2="225" class="line" marker-end="url(#arrowhead)"/>

  <rect x="240" y="225" width="250" height="45" rx="6" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.8"/>
  <text x="365" y="245" class="flow-text">Request Izin Akses Sensor GPS Browser</text>
  <text x="365" y="260" class="flow-bold">(Navigator Geolocation API)</text>

  <line x1="365" y1="270" x2="365" y2="300" class="line" marker-end="url(#arrowhead)"/>

  <polygon points="365,300 465,335 365,370 265,335" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="365" y="339" class="flow-decision">Izin GPS Diberikan?</text>

  <line x1="465" y1="335" x2="570" y2="335" class="line" marker-end="url(#arrowhead)"/>
  <text x="480" y="325" class="lbl-no">[Tidak]</text>
  <polygon points="570,315 720,315 700,355 550,355" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.8"/>
  <text x="635" y="335" class="flow-err">Pesan: Akses Lokasi Ditolak</text>
  <text x="635" y="348" class="flow-err">(Gagal Clock-In)</text>

  <path d="M 635 355 L 635 845 L 470 845" class="line" marker-end="url(#arrowhead)"/>

  <line x1="365" y1="370" x2="365" y2="405" class="line" marker-end="url(#arrowhead)"/>
  <text x="375" y="390" class="lbl-yes">[Ya]</text>

  <rect x="220" y="405" width="290" height="50" rx="6" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.8"/>
  <text x="365" y="425" class="flow-text">Dapatkan (lat_user, lng_user) &amp;</text>
  <text x="365" y="443" class="flow-bold">Ambil (lat_kantor, lng_kantor, radius) DB</text>

  <line x1="365" y1="455" x2="365" y2="485" class="line" marker-end="url(#arrowhead)"/>

  <rect x="200" y="485" width="330" height="75" rx="8" fill="#F0FDFA" stroke="#0F766E" stroke-width="2"/>
  <text x="365" y="505" class="flow-bold" fill="#0F766E">Perhitungan Rumus Haversine:</text>
  <text x="365" y="525" class="flow-text">a = sin²(Δφ/2) + cos(φ1)cos(φ2)sin²(Δλ/2)</text>
  <text x="365" y="542" class="flow-text">c = 2 * atan2(√a, √(1-a))  =&gt;  d = R * c (meter)</text>

  <line x1="365" y1="560" x2="365" y2="590" class="line" marker-end="url(#arrowhead)"/>

  <polygon points="365,590 470,625 365,660 260,625" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="365" y="629" class="flow-decision">Jarak d &lt;= Radius?</text>

  <line x1="470" y1="625" x2="570" y2="625" class="line" marker-end="url(#arrowhead)"/>
  <text x="485" y="615" class="lbl-no">[Tidak]</text>
  <polygon points="570,605 720,605 700,645 550,645" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.8"/>
  <text x="635" y="625" class="flow-err">Presensi Ditolak:</text>
  <text x="635" y="638" class="flow-err">Di Luar Jangkauan Kantor</text>

  <path d="M 635 645 L 635 845" class="line"/>

  <line x1="365" y1="660" x2="365" y2="695" class="line" marker-end="url(#arrowhead)"/>
  <text x="375" y="680" class="lbl-yes">[Ya]</text>

  <polygon points="365,695 470,730 365,765 260,730" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <text x="365" y="734" class="flow-decision">Sudah Absen Hari Ini?</text>

  <line x1="260" y1="730" x2="160" y2="730" class="line" marker-end="url(#arrowhead)"/>
  <text x="210" y="720" class="lbl-no">[Ya]</text>
  <polygon points="170,710 40,710 20,750 150,750" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.8"/>
  <text x="95" y="730" class="flow-err">Presensi Ditolak:</text>
  <text x="95" y="743" class="flow-err">Sudah Ada Record Hari Ini</text>

  <path d="M 95 750 L 95 845 L 290 845" class="line" marker-end="url(#arrowhead)"/>

  <line x1="365" y1="765" x2="365" y2="795" class="line" marker-end="url(#arrowhead)"/>
  <text x="375" y="780" class="lbl-yes">[Belum]</text>

  <rect x="220" y="795" width="290" height="35" rx="6" fill="#DCFCE7" stroke="#16A34A" stroke-width="2"/>
  <text x="365" y="818" class="flow-suc">Simpan ke Tabel attendance (status: 'present')</text>

  <line x1="365" y1="830" x2="365" y2="855" class="line" marker-end="url(#arrowhead)"/>

  <rect x="290" y="855" width="150" height="40" rx="20" fill="#003366" stroke="#002244" stroke-width="2"/>
  <text x="365" y="880" class="flow-title" font-size="14px">Selesai (End)</text>
</svg>`;
}

// 6. Entity Relationship Diagram (ERD)
function createErdSvg() {
    return `<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .erd-title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #FFFFFF; }
      .col-pk { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #B91C1C; }
      .col-fk { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #0369A1; }
      .col-name { font-family: Arial, sans-serif; font-size: 11px; font-weight: 500; fill: #0F172A; }
      .col-type { font-family: Arial, sans-serif; font-size: 10px; font-style: italic; fill: #64748B; }
      .rel-line { stroke: #003366; stroke-width: 2; fill: none; }
      .rel-label { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #003366; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- TABLE: user -->
  <g transform="translate(60, 180)">
    <rect x="0" y="0" width="220" height="260" rx="8" fill="#FFFFFF" stroke="#003366" stroke-width="2"/>
    <rect x="0" y="0" width="220" height="35" rx="8" fill="#003366"/>
    <rect x="0" y="20" width="220" height="15" fill="#003366"/>
    <text x="110" y="24" class="erd-title" text-anchor="middle">user (Pengguna)</text>
    
    <text x="12" y="55" class="col-pk">PK</text><text x="40" y="55" class="col-name">id</text><text x="145" y="55" class="col-type">: text (uuid)</text>
    <text x="12" y="75" class="col-name">    name</text><text x="145" y="75" class="col-type">: text</text>
    <text x="12" y="95" class="col-name">    email</text><text x="145" y="95" class="col-type">: text (unique)</text>
    <text x="12" y="115" class="col-name">    role</text><text x="145" y="115" class="col-type">: enum</text>
    <text x="12" y="135" class="col-name">    department</text><text x="145" y="135" class="col-type">: text</text>
    <text x="12" y="155" class="col-name">    image</text><text x="145" y="155" class="col-type">: text</text>
    <text x="12" y="175" class="col-name">    banned</text><text x="145" y="175" class="col-type">: boolean</text>
    <text x="12" y="195" class="col-name">    banReason</text><text x="145" y="195" class="col-type">: text</text>
    <text x="12" y="215" class="col-name">    createdAt</text><text x="145" y="215" class="col-type">: timestamp</text>
    <text x="12" y="235" class="col-name">    updatedAt</text><text x="145" y="235" class="col-type">: timestamp</text>
  </g>

  <!-- TABLE: attendance -->
  <g transform="translate(420, 40)">
    <rect x="0" y="0" width="240" height="220" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
    <rect x="0" y="0" width="240" height="35" rx="8" fill="#0284C7"/>
    <rect x="0" y="20" width="240" height="15" fill="#0284C7"/>
    <text x="120" y="24" class="erd-title" text-anchor="middle">attendance (Kehadiran)</text>
    
    <text x="12" y="55" class="col-pk">PK</text><text x="40" y="55" class="col-name">id</text><text x="150" y="55" class="col-type">: serial</text>
    <text x="12" y="75" class="col-fk">FK</text><text x="40" y="75" class="col-name">userId</text><text x="150" y="75" class="col-type">: text -&gt; user(id)</text>
    <text x="12" y="95" class="col-name">    date</text><text x="150" y="95" class="col-type">: timestamp</text>
    <text x="12" y="115" class="col-name">    checkInTime</text><text x="150" y="115" class="col-type">: timestamp</text>
    <text x="12" y="135" class="col-name">    checkOutTime</text><text x="150" y="135" class="col-type">: timestamp</text>
    <text x="12" y="155" class="col-name">    status</text><text x="150" y="155" class="col-type">: enum</text>
    <text x="12" y="175" class="col-name">    latitude</text><text x="150" y="175" class="col-type">: double precision</text>
    <text x="12" y="195" class="col-name">    longitude</text><text x="150" y="195" class="col-type">: double precision</text>
  </g>

  <!-- TABLE: leaves -->
  <g transform="translate(420, 310)">
    <rect x="0" y="0" width="240" height="180" rx="8" fill="#FFFFFF" stroke="#0F766E" stroke-width="2"/>
    <rect x="0" y="0" width="240" height="35" rx="8" fill="#0F766E"/>
    <rect x="0" y="20" width="240" height="15" fill="#0F766E"/>
    <text x="120" y="24" class="erd-title" text-anchor="middle">leaves (Permohonan Cuti)</text>
    
    <text x="12" y="55" class="col-pk">PK</text><text x="40" y="55" class="col-name">id</text><text x="150" y="55" class="col-type">: serial</text>
    <text x="12" y="75" class="col-fk">FK</text><text x="40" y="75" class="col-name">userId</text><text x="150" y="75" class="col-type">: text -&gt; user(id)</text>
    <text x="12" y="95" class="col-name">    type</text><text x="150" y="95" class="col-type">: enum</text>
    <text x="12" y="115" class="col-name">    startDate</text><text x="150" y="115" class="col-type">: timestamp</text>
    <text x="12" y="135" class="col-name">    endDate</text><text x="150" y="135" class="col-type">: timestamp</text>
    <text x="12" y="155" class="col-name">    status</text><text x="150" y="155" class="col-type">: enum</text>
    <text x="12" y="170" class="col-name">    reason</text><text x="150" y="170" class="col-type">: text</text>
  </g>

  <!-- TABLE: settings -->
  <g transform="translate(740, 180)">
    <rect x="0" y="0" width="210" height="120" rx="8" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
    <rect x="0" y="0" width="210" height="35" rx="8" fill="#6366F1"/>
    <rect x="0" y="20" width="210" height="15" fill="#6366F1"/>
    <text x="105" y="24" class="erd-title" text-anchor="middle">settings (Konfigurasi)</text>
    
    <text x="12" y="55" class="col-pk">PK</text><text x="40" y="55" class="col-name">key</text><text x="130" y="55" class="col-type">: text</text>
    <text x="12" y="75" class="col-name">    value</text><text x="130" y="75" class="col-type">: text (json)</text>
    <text x="12" y="95" class="col-name">    updatedAt</text><text x="130" y="95" class="col-type">: timestamp</text>
  </g>

  <!-- TABLE: session & account -->
  <g transform="translate(60, 520)">
    <rect x="0" y="0" width="260" height="140" rx="8" fill="#FFFFFF" stroke="#64748B" stroke-width="1.8"/>
    <rect x="0" y="0" width="260" height="30" rx="8" fill="#475569"/>
    <rect x="0" y="18" width="260" height="12" fill="#475569"/>
    <text x="130" y="20" class="erd-title" font-size="12px" text-anchor="middle">session (Better Auth)</text>
    
    <text x="12" y="50" class="col-pk">PK</text><text x="35" y="50" class="col-name">id</text><text x="140" y="50" class="col-type">: text</text>
    <text x="12" y="70" class="col-fk">FK</text><text x="35" y="70" class="col-name">userId</text><text x="140" y="70" class="col-type">: text -&gt; user(id)</text>
    <text x="12" y="90" class="col-name">token</text><text x="140" y="90" class="col-type">: text (unique)</text>
    <text x="12" y="110" class="col-name">expiresAt</text><text x="140" y="110" class="col-type">: timestamp</text>
  </g>

  <g transform="translate(380, 520)">
    <rect x="0" y="0" width="260" height="140" rx="8" fill="#FFFFFF" stroke="#64748B" stroke-width="1.8"/>
    <rect x="0" y="0" width="260" height="30" rx="8" fill="#475569"/>
    <rect x="0" y="18" width="260" height="12" fill="#475569"/>
    <text x="130" y="20" class="erd-title" font-size="12px" text-anchor="middle">account (Kredensial)</text>
    
    <text x="12" y="50" class="col-pk">PK</text><text x="35" y="50" class="col-name">id</text><text x="140" y="50" class="col-type">: text</text>
    <text x="12" y="70" class="col-fk">FK</text><text x="35" y="70" class="col-name">userId</text><text x="140" y="70" class="col-type">: text -&gt; user(id)</text>
    <text x="12" y="90" class="col-name">password</text><text x="140" y="90" class="col-type">: text (bcrypt)</text>
    <text x="12" y="110" class="col-name">providerId</text><text x="140" y="110" class="col-type">: text</text>
  </g>

  <!-- Relationships -->
  <path d="M 280 230 L 350 230 L 350 140 L 420 140" class="rel-line"/>
  <circle cx="285" cy="230" r="4" fill="#003366"/>
  <text x="300" y="222" class="rel-label">1</text>
  <text x="395" y="132" class="rel-label">N (1:N)</text>

  <path d="M 280 340 L 350 340 L 350 400 L 420 400" class="rel-line"/>
  <circle cx="285" cy="340" r="4" fill="#003366"/>
  <text x="300" y="332" class="rel-label">1</text>
  <text x="395" y="392" class="rel-label">N (1:N)</text>

  <path d="M 170 440 L 170 520" class="rel-line"/>
  <circle cx="170" cy="445" r="4" fill="#003366"/>
  <text x="178" y="475" class="rel-label">1:N</text>

  <path d="M 280 410 L 330 410 L 330 570 L 380 570" class="rel-line"/>
  <circle cx="285" cy="410" r="4" fill="#003366"/>
  <text x="340" y="490" class="rel-label">1:N</text>
</svg>`;
}

// 7. Prototype Mobile Karyawan (Beranda & Presensi)
function createPrototypeMobilePresensiSvg() {
    return `<svg width="450" height="780" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .app-title { font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #003366; }
      .text-reg { font-family: Arial, sans-serif; font-size: 12px; fill: #475569; }
      .text-bold { font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0F172A; }
      .btn-text { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
      .nav-label { font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; text-anchor: middle; }
    </style>
    <linearGradient id="grad-btn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="#F1F5F9"/>

  <rect x="25" y="15" width="400" height="750" rx="40" fill="#FFFFFF" stroke="#334155" stroke-width="6"/>
  <rect x="155" y="25" width="140" height="20" rx="10" fill="#334155"/>
  <circle cx="270" cy="35" r="4" fill="#1E293B"/>

  <text x="50" y="40" font-family="Arial" font-size="11px" font-weight="bold" fill="#334155">08:30</text>
  <text x="365" y="40" font-family="Arial" font-size="11px" font-weight="bold" fill="#334155">5G 100%</text>

  <rect x="45" y="60" width="360" height="55" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <circle cx="75" cy="88" r="18" fill="#003366"/>
  <text x="75" y="93" font-family="Arial" font-size="14px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">A</text>
  <text x="105" y="82" class="app-title">E-Absensi Pegawai</text>
  <text x="105" y="98" class="text-reg">Halo, Ahmad Fauzi (IT Staff)</text>

  <rect x="45" y="130" width="360" height="85" rx="12" fill="#003366"/>
  <text x="225" y="158" font-family="Arial" font-size="12px" fill="#93C5FD" text-anchor="middle">SENIN, 12 SEPTEMBER 2026</text>
  <text x="225" y="195" font-family="Arial" font-size="30px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">08:32:15 WIB</text>

  <rect x="45" y="230" width="360" height="110" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="65" y="255" class="text-bold">Status Kehadiran Hari Ini:</text>
  <rect x="270" y="240" width="115" height="24" rx="6" fill="#FEF3C7"/>
  <text x="327" y="256" font-family="Arial" font-size="11px" font-weight="bold" fill="#92400E" text-anchor="middle">Belum Clock-In</text>

  <line x1="65" y1="275" x2="385" y2="275" stroke="#E2E8F0" stroke-width="1"/>

  <text x="65" y="300" class="text-reg">Jam Masuk (Clock In):</text>
  <text x="280" y="300" class="text-bold" fill="#94A3B8">-- : -- : --</text>

  <text x="65" y="325" class="text-reg">Jam Pulang (Clock Out):</text>
  <text x="280" y="325" class="text-bold" fill="#94A3B8">-- : -- : --</text>

  <g transform="translate(65, 360)">
    <rect x="0" y="0" width="320" height="75" rx="16" fill="url(#grad-btn)" stroke="#047857" stroke-width="2"/>
    <circle cx="70" cy="38" r="22" fill="#FFFFFF" fill-opacity="0.25"/>
    <text x="70" y="44" font-family="Arial" font-size="20px" fill="#FFFFFF" text-anchor="middle">📍</text>
    <text x="180" y="45" class="btn-text">CLOCK IN MASUK</text>
  </g>

  <rect x="45" y="455" width="360" height="120" rx="12" fill="#F8FAFC" stroke="#0284C7" stroke-width="1.5"/>
  <text x="65" y="480" class="text-bold" fill="#0369A1">Deteksi Lokasi GPS &amp; Geofencing</text>
  
  <rect x="65" y="495" width="10" height="10" rx="5" fill="#16A34A"/>
  <text x="85" y="505" class="text-reg">GPS: <tspan font-weight="bold" fill="#0F172A">-6.208820, 106.845610</tspan></text>
  
  <text x="85" y="525" class="text-reg">Lokasi Kantor: Kantor Pusat Gedung Rianpedia</text>
  <text x="85" y="545" class="text-reg">Jarak ke Kantor: <tspan font-weight="bold" fill="#16A34A">12,4 meter</tspan> (Maks: 100 meter)</text>
  <rect x="65" y="555" width="320" height="12" rx="6" fill="#DCFCE7"/>
  <text x="225" y="565" font-family="Arial" font-size="10px" font-weight="bold" fill="#15803D" text-anchor="middle">✓ ANDA BERADA DI DALAM AREA KANTOR</text>

  <rect x="45" y="590" width="360" height="75" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <text x="60" y="612" class="text-bold" font-size="12px">Riwayat Presensi Kemarin:</text>
  <text x="60" y="632" class="text-reg">Jumat, 09 Sep 2026</text>
  <text x="60" y="650" class="text-reg">Masuk: 07:55 | Pulang: 17:05</text>
  <rect x="300" y="615" width="85" height="22" rx="4" fill="#DCFCE7"/>
  <text x="342" y="630" font-family="Arial" font-size="10px" font-weight="bold" fill="#15803D" text-anchor="middle">Tepat Waktu</text>

  <!-- Bottom Nav -->
  <rect x="45" y="675" width="360" height="60" rx="15" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <g transform="translate(85, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">🏠</text><text x="0" y="16" class="nav-label" fill="#003366">Beranda</text></g>
  <g transform="translate(175, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">📅</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Riwayat</text></g>
  <g transform="translate(265, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">📝</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Cuti</text></g>
  <g transform="translate(355, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">👤</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Profil</text></g>
</svg>`;
}

// 8. Prototype Mobile Karyawan (Pengajuan Cuti)
function createPrototypeMobileCutiSvg() {
    return `<svg width="450" height="780" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .app-title { font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #003366; }
      .text-reg { font-family: Arial, sans-serif; font-size: 12px; fill: #475569; }
      .text-bold { font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0F172A; }
      .form-lbl { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #1E293B; }
      .nav-label { font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; text-anchor: middle; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#F1F5F9"/>

  <!-- Phone Frame -->
  <rect x="25" y="15" width="400" height="750" rx="40" fill="#FFFFFF" stroke="#334155" stroke-width="6"/>
  <rect x="155" y="25" width="140" height="20" rx="10" fill="#334155"/>
  <circle cx="270" cy="35" r="4" fill="#1E293B"/>

  <text x="50" y="40" font-family="Arial" font-size="11px" font-weight="bold" fill="#334155">08:35</text>
  <text x="365" y="40" font-family="Arial" font-size="11px" font-weight="bold" fill="#334155">5G 100%</text>

  <!-- Header -->
  <rect x="45" y="60" width="360" height="50" rx="10" fill="#003366"/>
  <text x="225" y="90" font-family="Arial" font-size="15px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Formulir Pengajuan Cuti Mandiri</text>

  <!-- Form Container -->
  <rect x="45" y="125" width="360" height="420" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>

  <!-- Field 1: Jenis Cuti -->
  <text x="65" y="155" class="form-lbl">Jenis Ketidakhadiran / Cuti:</text>
  <rect x="65" y="165" width="320" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
  <text x="80" y="190" font-family="Arial" font-size="12px" fill="#0F172A">Izin Sakit (Surat Dokter Terlampir)</text>
  <text x="365" y="190" font-family="Arial" font-size="12px" fill="#64748B">▼</text>

  <!-- Field 2: Tanggal Mulai -->
  <text x="65" y="230" class="form-lbl">Tanggal Mulai Izin:</text>
  <rect x="65" y="240" width="320" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
  <text x="80" y="265" font-family="Arial" font-size="12px" fill="#0F172A">15/09/2026</text>
  <text x="360" y="265" font-size="14px">📅</text>

  <!-- Field 3: Tanggal Selesai -->
  <text x="65" y="305" class="form-lbl">Tanggal Berakhir Izin:</text>
  <rect x="65" y="315" width="320" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
  <text x="80" y="340" font-family="Arial" font-size="12px" fill="#0F172A">17/09/2026</text>
  <text x="360" y="340" font-size="14px">📅</text>

  <!-- Field 4: Alasan Cuti -->
  <text x="65" y="380" class="form-lbl">Alasan / Keterangan Pengajuan:</text>
  <rect x="65" y="390" width="320" height="70" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
  <text x="80" y="415" font-family="Arial" font-size="11px" fill="#64748B">Mengalami gejala demam dan flu, istirahat dokter selama 3 hari kerja.</text>

  <!-- Submit Button -->
  <rect x="65" y="475" width="320" height="50" rx="10" fill="#003366"/>
  <text x="225" y="506" font-family="Arial" font-size="14px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">KIRIM PERMOHONAN CUTI</text>

  <!-- Recent Submissions Preview Card -->
  <rect x="45" y="560" width="360" height="100" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="60" y="585" class="text-bold" font-size="12px">Riwayat Pengajuan Terakhir:</text>
  
  <rect x="60" y="598" width="330" height="50" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <text x="75" y="618" font-family="Arial" font-size="11px" font-weight="bold" fill="#0F172A">Cuti Tahunan (2 Hari)</text>
  <text x="75" y="635" font-family="Arial" font-size="10px" fill="#64748B">10 Ags 2026 - 11 Ags 2026</text>
  <rect x="290" y="612" width="85" height="22" rx="4" fill="#FEF3C7"/>
  <text x="332" y="627" font-family="Arial" font-size="10px" font-weight="bold" fill="#92400E" text-anchor="middle">Pending Review</text>

  <!-- Bottom Nav -->
  <rect x="45" y="675" width="360" height="60" rx="15" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <g transform="translate(85, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">🏠</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Beranda</text></g>
  <g transform="translate(175, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">📅</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Riwayat</text></g>
  <g transform="translate(265, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">📝</text><text x="0" y="16" class="nav-label" fill="#003366">Cuti</text></g>
  <g transform="translate(355, 705)"><text x="0" y="0" font-size="16px" text-anchor="middle">👤</text><text x="0" y="16" class="nav-label" fill="#94A3B8">Profil</text></g>
</svg>`;
}

// 9. Prototype Desktop Dashboard Admin
function createPrototypeDesktopAdminSvg() {
    return `<svg width="960" height="620" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .win-title { font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #475569; }
      .sb-title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #FFFFFF; }
      .sb-item { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #94A3B8; }
      .sb-active { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #FFFFFF; }
      .card-val { font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #003366; }
      .card-lbl { font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; fill: #64748B; }
      .th-text { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #FFFFFF; }
      .td-text { font-family: Arial, sans-serif; font-size: 11px; fill: #1E293B; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#F1F5F9"/>

  <rect x="15" y="15" width="930" height="590" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  
  <rect x="15" y="15" width="930" height="35" rx="10" fill="#E2E8F0"/>
  <circle cx="35" cy="32" r="5" fill="#EF4444"/>
  <circle cx="50" cy="32" r="5" fill="#F59E0B"/>
  <circle cx="65" cy="32" r="5" fill="#10B981"/>
  <rect x="100" y="22" width="600" height="20" rx="5" fill="#FFFFFF"/>
  <text x="115" y="36" font-family="Arial" font-size="11px" fill="#64748B">🔒 https://absensi-karyawan-three.vercel.app/admin</text>

  <!-- SIDEBAR -->
  <rect x="15" y="50" width="200" height="555" fill="#003366"/>
  <text x="35" y="85" class="sb-title">E-Absensi Admin</text>
  <text x="35" y="100" font-family="Arial" font-size="10px" fill="#93C5FD">Portal Manajemen HRD</text>
  <line x1="30" y1="115" x2="195" y2="115" stroke="#1E40AF" stroke-width="1"/>

  <rect x="25" y="130" width="180" height="32" rx="6" fill="#1E40AF"/>
  <text x="45" y="151" class="sb-active">📊 Dashboard Utama</text>
  <text x="45" y="190" class="sb-item">👥 Data Karyawan</text>
  <text x="45" y="230" class="sb-item">📋 Laporan Presensi</text>
  <text x="45" y="270" class="sb-item">✉️ Persetujuan Cuti</text>
  <text x="45" y="310" class="sb-item">⚙️ Pengaturan Kantor</text>

  <rect x="30" y="530" width="170" height="50" rx="6" fill="#0F172A"/>
  <text x="45" y="552" font-family="Arial" font-size="11px" font-weight="bold" fill="#FFFFFF">Administrator HRD</text>
  <text x="45" y="568" font-family="Arial" font-size="10px" fill="#94A3B8">admin@rianpedia.com</text>

  <!-- CONTENT -->
  <rect x="215" y="50" width="730" height="50" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <text x="240" y="80" font-family="Arial" font-size="16px" font-weight="bold" fill="#003366">Dashboard Ringkasan Operasional</text>
  <text x="800" y="80" font-family="Arial" font-size="11px" font-weight="bold" fill="#10B981">● Sistem Online</text>

  <!-- 3 KPI Cards -->
  <rect x="240" y="120" width="215" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="240" y="120" width="6" height="90" rx="3" fill="#003366"/>
  <text x="260" y="145" class="card-lbl">TOTAL KARYAWAN</text>
  <text x="260" y="180" class="card-val">24</text>
  <text x="310" y="180" class="card-lbl">Orang Staf Aktif</text>

  <rect x="475" y="120" width="215" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="475" y="120" width="6" height="90" rx="3" fill="#10B981"/>
  <text x="495" y="145" class="card-lbl">HADIR HARI INI</text>
  <text x="495" y="180" class="card-val" fill="#047857">18</text>
  <text x="545" y="180" class="card-lbl">Presensi Tercatat</text>

  <rect x="710" y="120" width="215" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="710" y="120" width="6" height="90" rx="3" fill="#F59E0B"/>
  <text x="730" y="145" class="card-lbl">CUTI PENDING</text>
  <text x="730" y="180" class="card-val" fill="#B45309">2</text>
  <text x="760" y="180" class="card-lbl">Perlu Verifikasi</text>

  <!-- Table Container -->
  <rect x="240" y="230" width="685" height="350" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="260" y="260" font-family="Arial" font-size="13px" font-weight="bold" fill="#003366">Aktivitas Kehadiran Terkini (Hari Ini)</text>

  <rect x="255" y="275" width="655" height="30" fill="#003366"/>
  <text x="270" y="295" class="th-text">Nama Karyawan</text>
  <text x="420" y="295" class="th-text">Departemen</text>
  <text x="540" y="295" class="th-text">Jam Masuk</text>
  <text x="650" y="295" class="th-text">Status</text>
  <text x="780" y="295" class="th-text">Validasi Geofencing</text>

  <rect x="255" y="305" width="655" height="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.5"/>
  <text x="270" y="325" class="td-text" font-weight="bold">Ahmad Fauzi</text>
  <text x="420" y="325" class="td-text">IT Development</text>
  <text x="540" y="325" class="td-text">07:55:12 WIB</text>
  <rect x="645" y="312" width="70" height="18" rx="4" fill="#DCFCE7"/>
  <text x="680" y="325" font-family="Arial" font-size="10px" font-weight="bold" fill="#15803D" text-anchor="middle">Tepat Waktu</text>
  <text x="780" y="325" class="td-text" fill="#15803D">✓ Valid (12m)</text>

  <rect x="255" y="337" width="655" height="32" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="0.5"/>
  <text x="270" y="357" class="td-text" font-weight="bold">Siti Nurhaliza</text>
  <text x="420" y="357" class="td-text">Keuangan &amp; Akuntansi</text>
  <text x="540" y="357" class="td-text">08:02:45 WIB</text>
  <rect x="645" y="344" width="70" height="18" rx="4" fill="#FEF3C7"/>
  <text x="680" y="357" font-family="Arial" font-size="10px" font-weight="bold" fill="#92400E" text-anchor="middle">Terlambat</text>
  <text x="780" y="357" class="td-text" fill="#15803D">✓ Valid (24m)</text>

  <rect x="255" y="369" width="655" height="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.5"/>
  <text x="270" y="389" class="td-text" font-weight="bold">Budi Santoso</text>
  <text x="420" y="389" class="td-text">Operasional Gudang</text>
  <text x="540" y="389" class="td-text">07:45:00 WIB</text>
  <rect x="645" y="376" width="70" height="18" rx="4" fill="#DCFCE7"/>
  <text x="680" y="389" font-family="Arial" font-size="10px" font-weight="bold" fill="#15803D" text-anchor="middle">Tepat Waktu</text>
  <text x="780" y="389" class="td-text" fill="#15803D">✓ Valid (5m)</text>

  <rect x="255" y="401" width="655" height="32" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="0.5"/>
  <text x="270" y="421" class="td-text" font-weight="bold">Dewi Sartika</text>
  <text x="420" y="421" class="td-text">Human Resource</text>
  <text x="540" y="421" class="td-text">07:58:19 WIB</text>
  <rect x="645" y="408" width="70" height="18" rx="4" fill="#DCFCE7"/>
  <text x="680" y="421" font-family="Arial" font-size="10px" font-weight="bold" fill="#15803D" text-anchor="middle">Tepat Waktu</text>
  <text x="780" y="421" class="td-text" fill="#15803D">✓ Valid (18m)</text>
</svg>`;
}

// 10. Prototype Desktop Pengaturan Geofencing & Peta Leaflet
function createPrototypeDesktopGeofencingSvg() {
    return `<svg width="960" height="620" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .sb-title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #FFFFFF; }
      .sb-item { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #94A3B8; }
      .sb-active { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #FFFFFF; }
      .form-lbl { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #1E293B; }
      .form-val { font-family: Arial, sans-serif; font-size: 12px; fill: #0F172A; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#F1F5F9"/>

  <rect x="15" y="15" width="930" height="590" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  
  <rect x="15" y="15" width="930" height="35" rx="10" fill="#E2E8F0"/>
  <circle cx="35" cy="32" r="5" fill="#EF4444"/>
  <circle cx="50" cy="32" r="5" fill="#F59E0B"/>
  <circle cx="65" cy="32" r="5" fill="#10B981"/>
  <rect x="100" y="22" width="600" height="20" rx="5" fill="#FFFFFF"/>
  <text x="115" y="36" font-family="Arial" font-size="11px" fill="#64748B">🔒 https://absensi-karyawan-three.vercel.app/admin/settings</text>

  <!-- SIDEBAR -->
  <rect x="15" y="50" width="200" height="555" fill="#003366"/>
  <text x="35" y="85" class="sb-title">E-Absensi Admin</text>
  <line x1="30" y1="105" x2="195" y2="105" stroke="#1E40AF" stroke-width="1"/>
  <text x="45" y="140" class="sb-item">📊 Dashboard Utama</text>
  <text x="45" y="180" class="sb-item">👥 Data Karyawan</text>
  <text x="45" y="220" class="sb-item">📋 Laporan Presensi</text>
  <text x="45" y="260" class="sb-item">✉️ Persetujuan Cuti</text>
  <rect x="25" y="285" width="180" height="32" rx="6" fill="#1E40AF"/>
  <text x="45" y="306" class="sb-active">⚙️ Pengaturan Kantor</text>

  <!-- CONTENT -->
  <rect x="215" y="50" width="730" height="50" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <text x="240" y="80" font-family="Arial" font-size="16px" font-weight="bold" fill="#003366">Konfigurasi Titik Lokasi Kantor &amp; Radius Geofencing</text>

  <!-- Left: Interactive Leaflet Map Preview -->
  <rect x="240" y="120" width="420" height="460" rx="8" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
  
  <rect x="242" y="122" width="416" height="456" rx="6" fill="#E0F2FE"/>
  <path d="M 242 250 L 658 250 M 242 420 L 658 420 M 450 122 L 450 578 M 340 122 L 340 578" stroke="#BAE6FD" stroke-width="8"/>
  <path d="M 242 330 L 658 350 M 380 122 L 520 578" stroke="#FFFFFF" stroke-width="12"/>

  <rect x="255" y="135" width="28" height="54" rx="4" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1"/>
  <text x="269" y="154" font-family="Arial" font-size="16px" font-weight="bold" fill="#334155" text-anchor="middle">+</text>
  <line x1="255" y1="162" x2="283" y2="162" stroke="#CBD5E1" stroke-width="1"/>
  <text x="269" y="181" font-family="Arial" font-size="16px" font-weight="bold" fill="#334155" text-anchor="middle">-</text>

  <!-- Geofence Radius Circle -->
  <circle cx="450" cy="340" r="110" fill="#0284C7" fill-opacity="0.2" stroke="#0284C7" stroke-width="2" stroke-dasharray="6,4"/>

  <!-- Center Pin Marker -->
  <circle cx="450" cy="340" r="6" fill="#003366"/>
  <path d="M 450 340 C 430 310 430 280 450 280 C 470 280 470 310 450 340 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
  <circle cx="450" cy="295" r="5" fill="#FFFFFF"/>

  <rect x="375" y="240" width="150" height="30" rx="4" fill="#003366"/>
  <text x="450" y="259" font-family="Arial" font-size="10px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Titik Kantor Pusat (Radius: 100m)</text>

  <!-- Right: Form Controls -->
  <rect x="680" y="120" width="245" height="460" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="700" y="150" class="form-lbl" font-size="13px" fill="#003366">Parameter Geofencing</text>

  <text x="700" y="185" class="form-lbl">Latitude (Garis Lintang):</text>
  <rect x="700" y="195" width="205" height="32" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  <text x="712" y="216" class="form-val">-6.208800</text>

  <text x="700" y="250" class="form-lbl">Longitude (Garis Bujur):</text>
  <rect x="700" y="260" width="205" height="32" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  <text x="712" y="281" class="form-val">106.845600</text>

  <text x="700" y="315" class="form-lbl">Radius Toleransi (Meter):</text>
  <rect x="700" y="325" width="205" height="32" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  <text x="712" y="346" class="form-val">100</text>

  <text x="700" y="380" class="form-lbl">Status Fitur Geofencing:</text>
  <rect x="700" y="390" width="50" height="26" rx="13" fill="#10B981"/>
  <circle cx="737" cy="403" r="10" fill="#FFFFFF"/>
  <text x="760" y="408" class="form-val" font-weight="bold" fill="#047857">AKTIF</text>

  <rect x="700" y="435" width="205" height="65" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
  <text x="710" y="455" font-family="Arial" font-size="10px" fill="#1E40AF">💡 Geser pin di peta untuk</text>
  <text x="710" y="470" font-family="Arial" font-size="10px" fill="#1E40AF">memperbarui koordinat GPS</text>
  <text x="710" y="485" font-family="Arial" font-size="10px" fill="#1E40AF">secara otomatis.</text>

  <rect x="700" y="520" width="205" height="40" rx="8" fill="#003366"/>
  <text x="802" y="545" font-family="Arial" font-size="13px" font-weight="bold" fill="#FFFFFF" text-anchor="middle">💾 Simpan Konfigurasi</text>
</svg>`;
}

async function generateAllDiagrams() {
    console.log("Memulai pembuatan gambar diagram & prototype untuk Bab 3...");

    const tasks = [
        { name: "gambar-3-1-use-case-diagram.png", svg: createUseCaseSvg() },
        { name: "gambar-3-2-activity-diagram-presensi.png", svg: createActivityPresensiSvg() },
        { name: "gambar-3-3-activity-diagram-cuti.png", svg: createActivityCutiSvg() },
        { name: "gambar-3-4-sequence-diagram-presensi.png", svg: createSequenceDiagramSvg() },
        { name: "gambar-3-5-flowchart-geofencing.png", svg: createFlowchartSvg() },
        { name: "gambar-3-6-erd-database.png", svg: createErdSvg() },
        { name: "gambar-3-7-prototype-mobile-presensi.png", svg: createPrototypeMobilePresensiSvg() },
        { name: "gambar-3-8-prototype-mobile-cuti.png", svg: createPrototypeMobileCutiSvg() },
        { name: "gambar-3-9-prototype-desktop-admin.png", svg: createPrototypeDesktopAdminSvg() },
        { name: "gambar-3-10-prototype-desktop-geofencing.png", svg: createPrototypeDesktopGeofencingSvg() }
    ];

    for (const t of tasks) {
        const dest = path.join(outputDir, t.name);
        const cleanSvg = t.svg.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
        await sharp(Buffer.from(cleanSvg))
            .png({ quality: 100 })
            .toFile(dest);
        console.log(`Berhasil membuat: ${t.name}`);
    }

    console.log("Semua 10 diagram dan simulasi prototype Bab 3 telah selesai dibuat!");
}

generateAllDiagrams();
