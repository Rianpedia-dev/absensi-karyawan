const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    Footer,
    PageNumber,
    ImageRun
} = require("docx");
const fs = require("fs");
const path = require("path");

// Pastikan direktori dan 10 gambar diagram & prototype Bab 3 telah dibuat
const diagramDir = path.join(__dirname, "diagram-bab-3");
if (!fs.existsSync(diagramDir) || fs.readdirSync(diagramDir).length < 10) {
    console.log("Menjalankan pembuatan aset visual diagram & prototype Bab 3...");
    require("./generate-diagrams.js");
}

// Konfigurasi Margin Standar Skripsi Indonesia (dalam dxa: 1 cm = 567 dxa)
// Format 4 cm (kiri), 3 cm (atas), 3 cm (bawah), 3 cm (kanan)
const MARGIN_LEFT = 2268;   // 4 cm
const MARGIN_TOP = 1701;    // 3 cm
const MARGIN_BOTTOM = 1701; // 3 cm
const MARGIN_RIGHT = 1701;  // 3 cm

// Daftar istilah teknis & bahasa Inggris yang otomatis dicetak miring (italic)
const ENGLISH_WORDS = [
    "geofencing", "black-box testing", "black-box", "testing", "blueprint", "database", "real-time",
    "browser", "clock in", "clock-in", "clock out", "clock-out", "dashboard", "wireframe", "wireframes",
    "prototyping", "prototype", "use case diagram", "use case", "activity diagram",
    "sequence diagram", "flowchart", "entity relationship diagram", "erd", "functional requirements",
    "non-functional requirements", "mockup", "mockups", "administrator", "crud", "role-based access control",
    "rbac", "backend", "frontend", "server actions", "server action", "client components", "server components",
    "browser geolocation api", "geolocation api", "geolocation", "middleware", "type safety", "authentication engine",
    "cookie", "cookies", "token", "password hash", "login", "log in", "log-in", "logout", "log out", "log-out",
    "sign in", "sign out", "latitude", "longitude", "radius", "error", "record", "lat", "lng", "db", "refresh",
    "checkintime", "checkouttime", "leave", "leaves", "form", "pending", "approved", "rejected", "mobile view",
    "desktop view", "mobile-first", "smartphone", "check-in", "check-out", "list", "vacation", "sick", "other",
    "present", "late", "absent", "sidebar", "card", "cards", "modal", "pop-up", "filter", "input", "output",
    "hardware", "software", "runtime environment", "framework", "database server", "hosted", "client", "client-side",
    "server-side", "hash", "role", "mobile", "desktop", "monitoring", "create, read, update, delete", "query",
    "full-stack", "fullstack", "app router", "codebase", "user interface", "layout", "gps", "email", "account",
    "user", "admin", "employee", "attendance", "id", "session", "string", "json", "settings", "leaflet map",
    "leaflet", "map", "validation", "uuid", "auth", "api", "typescript", "javascript", "postgresql", "drizzle kit",
    "zod", "bcryptjs", "bcrypt", "node.js", "next.js", "drizzle orm", "better auth", "microsoft windows",
    "supabase", "ide", "visual studio code", "url", "deploy", "online", "vercel", "great-circle distance",
    "haversine formula", "haversine", "swimlane", "route guard", "route guards", "http-only", "httponly",
    "cascading delete", "cascade delete", "primary key", "foreign key", "unique key", "auto-increment",
    "null", "not null", "boolean", "timestamp", "serial", "double precision", "text", "float", "tailwind css",
    "shadcn/ui", "lucide react", "communication", "quick design", "construction of prototype", "customer evaluation",
    "refining prototype", "final product"
];

// Buat regex untuk pencocokan kata bahasa Inggris (case-insensitive, memprioritaskan frasa terpanjang)
const sortedWords = [...ENGLISH_WORDS].sort((a, b) => b.length - a.length);
const escWords = sortedWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
const englishRegex = new RegExp(`\\b(${escWords.join('|')})\\b`, 'gi');

// Helper untuk membuat Paragraf standar skripsi dengan otomatisasi miring istilah asing
function createParagraph(textRuns, options = {}) {
    const runs = [];
    if (typeof textRuns === 'string') {
        const parts = textRuns.split(englishRegex);
        parts.forEach((part, index) => {
            if (index % 2 === 1) {
                // Istilah bahasa Inggris (cetak miring)
                runs.push(new TextRun({
                    text: part,
                    font: "Times New Roman",
                    size: options.size || 24, // 12pt default
                    bold: options.bold,
                    italics: true
                }));
            } else {
                // Teks biasa
                if (part) {
                    runs.push(new TextRun({
                        text: part,
                        font: "Times New Roman",
                        size: options.size || 24,
                        bold: options.bold,
                        italics: options.italic || options.italics
                    }));
                }
            }
        });
    } else if (Array.isArray(textRuns)) {
        textRuns.forEach(run => {
            if (typeof run === 'string') {
                const parts = run.split(englishRegex);
                parts.forEach((part, index) => {
                    if (index % 2 === 1) {
                        runs.push(new TextRun({
                            text: part,
                            font: "Times New Roman",
                            size: options.size || 24,
                            italics: true
                        }));
                    } else {
                        if (part) {
                            runs.push(new TextRun({
                                text: part,
                                font: "Times New Roman",
                                size: options.size || 24
                            }));
                        }
                    }
                });
            } else {
                if (run.text && !run.italic && !run.italics) {
                    const parts = run.text.split(englishRegex);
                    parts.forEach((part, index) => {
                        if (index % 2 === 1) {
                            runs.push(new TextRun({
                                ...run,
                                text: part,
                                font: "Times New Roman",
                                size: run.size || options.size || 24,
                                italics: true
                            }));
                        } else {
                            if (part) {
                                runs.push(new TextRun({
                                    ...run,
                                    text: part,
                                    font: "Times New Roman",
                                    size: run.size || options.size || 24
                                }));
                            }
                        }
                    });
                } else {
                    runs.push(new TextRun({
                        font: "Times New Roman",
                        size: 24,
                        ...run,
                        italics: run.italic || run.italics
                    }));
                }
            }
        });
    }

    return new Paragraph({
        children: runs,
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        spacing: {
            line: 360, // Spasi 1.5
            before: options.before !== undefined ? options.before : 0,
            after: options.after !== undefined ? options.after : 120, // 6pt after
        },
        indent: options.indent,
    });
}

// Helper untuk membuat Bullet List
function createBulletItem(text, prefix = "•  ") {
    return createParagraph([
        { text: prefix, bold: true },
        { text: text }
    ], {
        after: 60,
        indent: { left: 720, hanging: 360 }
    });
}

// Helper untuk membuat Heading Bab & Sub-Bab
function createHeading(text, level, options = {}) {
    let size = 24; // 12pt
    let bold = true;
    let alignment = AlignmentType.LEFT;
    let beforeSpacing = 240; // 12pt
    let afterSpacing = 480;  // 24pt (Spasi 2.0)

    if (level === 1) {
        size = 28; // 14pt untuk judul BAB
        alignment = AlignmentType.CENTER;
        beforeSpacing = options.before !== undefined ? options.before : 480;
        afterSpacing = options.after !== undefined ? options.after : 480;
    } else if (level === 2) {
        size = 26; // 13pt
        beforeSpacing = options.before !== undefined ? options.before : 360;
        afterSpacing = options.after !== undefined ? options.after : 360;
    } else if (level === 3) {
        size = 24; // 12pt
        beforeSpacing = options.before !== undefined ? options.before : 240;
        afterSpacing = options.after !== undefined ? options.after : 240;
    }

    const runs = [];
    const parts = text.split(englishRegex);
    parts.forEach((part, index) => {
        if (index % 2 === 1) {
            runs.push(new TextRun({
                text: part,
                bold: bold,
                italics: true,
                font: "Times New Roman",
                size: size,
                color: "000000"
            }));
        } else {
            if (part) {
                runs.push(new TextRun({
                    text: part,
                    bold: bold,
                    font: "Times New Roman",
                    size: size,
                    color: "000000"
                }));
            }
        }
    });

    return new Paragraph({
        children: runs,
        heading: level === 1 ? HeadingLevel.HEADING_1 : (level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3),
        alignment: alignment,
        pageBreakBefore: options.pageBreakBefore || false,
        spacing: {
            before: beforeSpacing,
            after: afterSpacing,
            line: 240
        },
        keepWithNext: true
    });
}

// Helper untuk membuat Code Block yang rapi
function createCodeBlock(code) {
    const lines = code.split('\n');
    const paragraphs = lines.map(line => new Paragraph({
        children: [
            new TextRun({
                text: line,
                font: "Consolas",
                size: 18, // 9pt
                color: "000000"
            })
        ],
        spacing: {
            line: 280,
            before: 20,
            after: 20
        }
    }));

    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: paragraphs,
                        shading: {
                            fill: "F8F9FA"
                        },
                        margins: {
                            top: 240,
                            bottom: 240,
                            left: 240,
                            right: 240
                        },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
                            bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
                            left: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                            right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" }
                        }
                    })
                ]
            })
        ]
    });
}

// Helper untuk membuat Caption Tabel berstandar skripsi
function createTableCaption(tableNumber, title) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: `${tableNumber} ${title}`,
                bold: true,
                font: "Times New Roman",
                size: 20 // 10pt
            })
        ],
        spacing: { before: 200, after: 100, line: 240 },
        keepWithNext: true
    });
}

// Helper untuk membuat Tabel dengan desain premium akademik
function createStyledTable(headers, rows) {
    const tableRows = [];

    // Header Row
    tableRows.push(new TableRow({
        tableHeader: true,
        children: headers.map(headerText => new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: headerText,
                            bold: true,
                            font: "Times New Roman",
                            size: 20, // 10pt
                            color: "FFFFFF"
                        })
                    ],
                    alignment: AlignmentType.CENTER
                })
            ],
            shading: {
                fill: "003366" // Dark Blue Header
            },
            margins: {
                top: 120,
                bottom: 120,
                left: 100,
                right: 100
            },
            verticalAlign: "center"
        }))
    }));

    // Data Rows
    rows.forEach((row, rowIndex) => {
        tableRows.push(new TableRow({
            children: row.map(cellText => new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: cellText,
                                font: "Times New Roman",
                                size: 20 // 10pt
                            })
                        ],
                        spacing: {
                            line: 240,
                            before: 60,
                            after: 60
                        }
                    })
                ],
                shading: {
                    fill: rowIndex % 2 === 0 ? "FFFFFF" : "F4F7FB"
                },
                margins: {
                    top: 100,
                    bottom: 100,
                    left: 100,
                    right: 100
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
                    left: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
                    right: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" }
                }
            }))
        }));
    });

    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        },
        rows: tableRows
    });
}

// Helper untuk membuat sesi Gambar Screenshot Halaman Bab IV
function createPageScreenshotSection(fileName, imageTitle, description, index, isMobile = false) {
    const imagePath = path.join(__dirname, "image-halaman-bahan-skripsi", fileName);
    const elements = [];

    // 0. Heading Sub-sub-bab (Level 3)
    elements.push(createHeading(`4.4.${index} Halaman ${imageTitle}`, 3));

    // 1. Render Gambar jika file ada
    if (fs.existsSync(imagePath)) {
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            elements.push(new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        data: imageBuffer,
                        transformation: {
                            width: isMobile ? 225 : 500,
                            height: isMobile ? 400 : 281,
                        }
                    })
                ],
                spacing: { before: 180, after: 120 }
            }));
        } catch (e) {
            console.error(`Gagal menyematkan gambar ${fileName}:`, e);
            elements.push(createParagraph(`[Gambar: ${imageTitle} - Gagal memproses data gambar]`, { alignment: AlignmentType.CENTER, italic: true }));
        }
    } else {
        console.warn(`Gambar tidak ditemukan: ${imagePath}`);
        elements.push(createParagraph(`[Gambar: ${imageTitle} - File ${fileName} tidak ditemukan di folder bahan]`, { alignment: AlignmentType.CENTER, italic: true }));
    }

    // 2. Caption Gambar (Format Standar: Gambar 4.x Judul Halaman)
    elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: `Gambar 4.${index} Halaman ${imageTitle}`,
                bold: true,
                font: "Times New Roman",
                size: 20 // 10pt
            })
        ],
        spacing: { before: 60, after: 120, line: 240 },
        keepWithNext: true
    }));

    // 3. Deskripsi Fungsional Akademik
    elements.push(createParagraph(description, { after: 180 }));

    return elements;
}

// Helper untuk menyematkan Gambar Diagram / Flowchart / Prototype pada Bab 3
function createDiagramSection(fileName, figureTitle, description, figureNumber, width = 500, height = 350) {
    const imagePath = path.join(__dirname, "diagram-bab-3", fileName);
    const elements = [];

    // 1. Render Gambar jika file ada
    if (fs.existsSync(imagePath)) {
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            elements.push(new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        data: imageBuffer,
                        transformation: {
                            width: width,
                            height: height
                        }
                    })
                ],
                spacing: { before: 180, after: 120 }
            }));
        } catch (e) {
            console.error(`Gagal menyematkan diagram ${fileName}:`, e);
            elements.push(createParagraph(`[Gambar: ${figureTitle} - Gagal memproses data gambar]`, { alignment: AlignmentType.CENTER, italic: true }));
        }
    } else {
        console.warn(`File diagram tidak ditemukan: ${imagePath}`);
        elements.push(createParagraph(`[Gambar: ${figureTitle} - File tidak ditemukan di folder diagram]`, { alignment: AlignmentType.CENTER, italic: true }));
    }

    // 2. Caption Gambar (Format Standar: Gambar 3.x Judul Gambar)
    elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: `Gambar ${figureNumber} ${figureTitle}`,
                bold: true,
                font: "Times New Roman",
                size: 20 // 10pt
            })
        ],
        spacing: { before: 60, after: 120, line: 240 },
        keepWithNext: true
    }));

    // 3. Deskripsi jika ada
    if (description) {
        elements.push(createParagraph(description, { after: 180 }));
    }

    return elements;
}

// ==========================================
// FUNGSI PEMBANGUN KONTEN BAB III: DESAIN SISTEM
// ==========================================
function buildBab3() {
    const bab3 = [];

    // --- HEADING BAB III ---
    bab3.push(createHeading("BAB III", 1));
    bab3.push(createHeading("DESAIN SISTEM", 1, { before: 120, after: 480 }));

    // Pengantar Bab III
    bab3.push(createParagraph(
        "Bab ini menjelaskan mengenai perancangan dan desain sistem aplikasi Absensi Pegawai secara menyeluruh. Proses perancangan sistem ini mencakup metodologi pengembangan perangkat lunak menggunakan model Prototyping, analisis kebutuhan sistem (fungsional dan non-fungsional), pemodelan sistem menggunakan Unified Modeling Language (UML), perancangan arsitektur perangkat lunak, perancangan algoritma geofencing menggunakan rumus matematis Haversine, perancangan basis data relasional (ERD dan kamus data), serta perancangan prototype antarmuka pengguna (User Interface). Rangkaian tahapan perancangan ini dijadikan sebagai landasan ilmiah dan teknis yang kokoh sebelum melangkah ke tahap implementasi sistem pada Bab IV."
    ));

    // --- 3.1 METODOLOGI PENGEMBANGAN SISTEM (MODEL PROTOTYPING) ---
    bab3.push(createHeading("3.1 Metodologi Pengembangan Sistem (Model Prototyping)", 2));
    bab3.push(createParagraph(
        "Dalam penelitian skripsi ini, metodologi pengembangan perangkat lunak yang digunakan adalah model Prototyping. Model Prototyping merupakan paradigma rekayasa perangkat lunak yang menitikberatkan pada pembuatan model kerja awal (prototype) dari sistem yang akan dibangun. Pendekatan ini dipilih karena sistem absensi pegawai berbasis web dengan geofencing memiliki dua karakteristik pengguna yang sangat bertolak belakang, yaitu karyawan lapangan yang menuntut antarmuka mobile yang sangat sederhana (cukup satu kali klik presensi) serta administrator/HRD yang membutuhkan antarmuka desktop layar lebar dengan visualisasi pemetaan geografis dan rekapitulasi data."
    ));
    bab3.push(createParagraph(
        "Melalui model Prototyping, pengembang dan pengguna (staf HRD serta perwakilan karyawan) dapat berinteraksi secara aktif sejak fase awal pengembangan. Pengguna dapat melihat, mencoba, dan mengevaluasi representasi sistem nyata secara bertahap, sehingga potensi kesalahpahaman kebutuhan sistem dapat diminimalisir dan umpan balik (feedback) dapat langsung disempurnakan sebelum kode program sistem inti ditulis secara menyeluruh."
    ));

    bab3.push(createParagraph(
        "Tahapan model Prototyping yang diterapkan dalam penelitian ini terdiri dari 6 (enam) tahapan sistematis sebagai berikut:"
    ));

    bab3.push(createBulletItem("1. Pengumpulan Kebutuhan (Communication / Requirements Gathering): Peneliti melakukan observasi terhadap kendala operasional absensi manual serta wawancara dengan pemangku kepentingan untuk mengidentifikasi kebutuhan inti, seperti perlunya validasi lokasi GPS akurat untuk mencegah manipulasi kehadiran, pencatatan waktu otomatis, dan otomasi persetujuan cuti."));
    bab3.push(createBulletItem("2. Perancangan Cepat (Quick Design): Berdasarkan hasil analisis kebutuhan, peneliti membuat sketsa cepat rancangan alur sistem, diagram alir, dan wireframe kasar yang menggambarkan struktur navigasi serta tata letak tombol antarmuka mobile maupun desktop."));
    bab3.push(createBulletItem("3. Pembangunan Prototype (Construction of Prototype): Peneliti merealisasikan rancangan cepat ke dalam bentuk rancangan antarmuka interaktif dan antarmuka komponen awal menggunakan Next.js dan Tailwind CSS, mencakup halaman login, beranda presensi mobile karyawan, dan panel kontrol admin."));
    bab3.push(createBulletItem("4. Evaluasi Prototype oleh Pengguna (Customer / User Evaluation): Prototipe sistem didemonstrasikan kepada pengguna untuk diuji kenyamanan navigasinya. Pada tahap ini, pengguna memberikan evaluasi seperti perlunya penanda visual lingkaran radius pada peta Leaflet admin dan perubahan warna tombol presensi (hijau saat belum clock in, merah setelah clock in)."));
    bab3.push(createBulletItem("5. Perbaikan dan Pemurnian Prototype (Refining Prototype): Masukan dan evaluasi dari pengguna dianalisis untuk menyempurnakan rancangan. Struktur data dan validasi logika diperbaiki, batasan koordinat disesuaikan, dan tampilan responsif mobile dioptimalkan."));
    bab3.push(createBulletItem("6. Pembuatan Sistem Akhir (Final Product Engineering): Setelah prototipe disetujui, pengembangan dilanjutkan ke tahap integrasi penuh backend, menghubungkan Server Actions, mengintegrasikan Drizzle ORM dengan PostgreSQL Supabase, memasang enkripsi kata sandi Bcrypt, serta mengunci sistem keamanan otentikasi Better Auth."));

    // Tabel 3.1
    bab3.push(createTableCaption("Tabel 3.1", "Matriks Tahapan Prototyping dan Output Aktivitas Penelitian"));
    bab3.push(createStyledTable(
        ["No", "Tahapan Prototyping", "Aktivitas Utama yang Dilakukan", "Output / Hasil Tahapan"],
        [
            ["1", "Communication (Pengumpulan Kebutuhan)", "Observasi absensi manual & wawancara kebutuhan HRD dan karyawan.", "Daftar spesifikasi kebutuhan fungsional & non-fungsional sistem."],
            ["2", "Quick Design (Perancangan Cepat)", "Pemodelan alur kerja, perancangan sketsa wireframe, dan skema database awal.", "Dokumen rancangan UML, sketsa antarmuka, dan skema relasi data."],
            ["3", "Construction of Prototype (Pembangunan Prototipe)", "Membangun prototipe UI mobile-first untuk karyawan dan dashboard admin.", "Prototipe antarmuka interaktif yang dapat diuji coba pengguna."],
            ["4", "User Evaluation (Evaluasi Pengguna)", "Pengujian prototipe oleh HRD dan perwakilan staf untuk menjaring masukan.", "Catatan perbaikan fitur: tombol presensi dinamis & visualisasi radius peta."],
            ["5", "Refining Prototype (Pemurnian Prototipe)", "Mengakomodasi perbaikan antarmuka dan menyesuaikan toleransi radius geofencing.", "Desain antarmuka final yang disetujui dan siap dikodekan."],
            ["6", "Final Product (Sistem Akhir)", "Pengodean penuh sistem, Server Actions, Drizzle ORM, dan pengujian Black-box.", "Aplikasi Absensi Pegawai berbasis web terintegrasi dan siap dioperasikan."]
        ]
    ));
    bab3.push(createParagraph("", { after: 180 }));

    // --- 3.2 ANALISIS KEBUTUHAN SISTEM ---
    bab3.push(createHeading("3.2 Analisis Kebutuhan Sistem", 2));
    bab3.push(createParagraph(
        "Analisis kebutuhan dilakukan untuk mendefinisikan kapabilitas fungsional yang harus disediakan oleh aplikasi serta kriteria kualitas operasional yang wajib dipenuhi. Analisis kebutuhan dikelompokkan menjadi dua aspek utama, yaitu Kebutuhan Fungsional (Functional Requirements) dan Kebutuhan Non-Fungsional (Non-Functional Requirements)."
    ));

    // 3.2.1 Kebutuhan Fungsional
    bab3.push(createHeading("3.2.1 Kebutuhan Fungsional (Functional Requirements)", 3));
    bab3.push(createParagraph(
        "Kebutuhan fungsional mendefinisikan layanan atau fungsi spesifik yang disediakan oleh sistem Absensi Pegawai kepada pengguna berdasarkan hak akses perannya (Role-Based Access):"
    ));

    // Tabel 3.2
    bab3.push(createTableCaption("Tabel 3.2", "Analisis Kebutuhan Fungsional Sistem"));
    bab3.push(createStyledTable(
        ["Kode", "Aktor Terkait", "Deskripsi Kebutuhan Fungsional", "Tingkat Prioritas"],
        [
            ["FR-EMP-01", "Karyawan", "Sistem menyediakan formulir masuk (log in) menggunakan alamat email dan kata sandi.", "Tinggi (Mandatory)"],
            ["FR-EMP-02", "Karyawan", "Sistem mendeteksi koordinat garis lintang dan bujur pengguna secara otomatis via GPS browser.", "Tinggi (Mandatory)"],
            ["FR-EMP-03", "Karyawan", "Sistem memvalidasi jarak posisi pengguna terhadap kantor pusat menggunakan rumus Haversine.", "Tinggi (Mandatory)"],
            ["FR-EMP-04", "Karyawan", "Sistem mencatat presensi masuk (clock-in) harian apabila berada di dalam radius toleransi kantor.", "Tinggi (Mandatory)"],
            ["FR-EMP-05", "Karyawan", "Sistem mencatat presensi pulang (clock-out) harian dan memperbarui data kehadiran di database.", "Tinggi (Mandatory)"],
            ["FR-EMP-06", "Karyawan", "Sistem menampilkan riwayat kehadiran pribadi (tanggal, waktu masuk/pulang, dan status kehadiran).", "Sedang (Desirable)"],
            ["FR-EMP-07", "Karyawan", "Sistem menyediakan formulir pengajuan izin/cuti mandiri dengan memilih jenis, tanggal, dan alasan.", "Tinggi (Mandatory)"],
            ["FR-EMP-08", "Karyawan", "Sistem menyediakan halaman profil pengguna dan fungsi keluar sistem (log out) yang menghapus sesi.", "Sedang (Desirable)"],
            ["FR-ADM-01", "Administrator", "Sistem membatasi akses modul administrator hanya untuk pengguna yang memiliki role admin.", "Tinggi (Mandatory)"],
            ["FR-ADM-02", "Administrator", "Sistem menyajikan dashboard ringkasan statistik (total staf, hadir hari ini, dan cuti pending).", "Tinggi (Mandatory)"],
            ["FR-ADM-03", "Administrator", "Sistem menyediakan fitur manajemen data akun karyawan (Create, Read, Update, Delete).", "Tinggi (Mandatory)"],
            ["FR-ADM-04", "Administrator", "Sistem menyajikan tabel laporan kehadiran staf dengan fitur filter rentang tanggal dan departemen.", "Tinggi (Mandatory)"],
            ["FR-ADM-05", "Administrator", "Sistem menyediakan fitur persetujuan (approval) dan penolakan (rejection) permohonan cuti karyawan.", "Tinggi (Mandatory)"],
            ["FR-ADM-06", "Administrator", "Sistem menyediakan peta interaktif Leaflet untuk menentukan titik koordinat latitude dan longitude kantor.", "Tinggi (Mandatory)"],
            ["FR-ADM-07", "Administrator", "Sistem memungkinkan pengaturan batas toleransi radius geofencing (dalam meter) serta toggle status aktif.", "Tinggi (Mandatory)"]
        ]
    ));
    bab3.push(createParagraph("", { after: 180 }));

    // 3.2.2 Kebutuhan Non-Fungsional
    bab3.push(createHeading("3.2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)", 3));
    bab3.push(createParagraph(
        "Kebutuhan non-fungsional menitikberatkan pada aspek properti perilaku, kualitas, dan kendala operasional sistem agar aplikasi dapat berjalan secara handal, aman, dan efisien:"
    ));

    // Tabel 3.3
    bab3.push(createTableCaption("Tabel 3.3", "Analisis Kebutuhan Non-Fungsional Sistem"));
    bab3.push(createStyledTable(
        ["Parameter", "Kriteria Kebutuhan Non-Fungsional", "Tolak Ukur / Spesifikasi"],
        [
            ["Kinerja (Performance)", "Waktu respon eksekusi Server Actions untuk kalkulasi geofencing dan penyimpanan absensi harus sangat cepat.", "Respon sistem < 1,5 detik pada koneksi internet standar seluler."],
            ["Keamanan (Security)", "Kata sandi pengguna dienkripsi searah menggunakan algoritma Bcrypt. Manajemen sesi login menggunakan token acak dengan cookie Http-Only.", "Pencegahan serangan manipulasi URL & pencurian token sesi via XSS."],
            ["Kehandalan (Reliability)", "Sistem dapat menangani kegagalan penarikan sensor GPS (misalnya saat pengguna menolak izin lokasi) dengan pesan panduan yang jelas.", "Sistem tidak mengalami crash dan mengembalikan pesan error yang informatif."],
            ["Akurasi (Accuracy)", "Perhitungan jarak antara posisi karyawan dan kantor menggunakan rumus trigonometri bola Haversine dengan presisi tinggi.", "Toleransi selisih jarak perhitungan geofencing < 1 meter."],
            ["Portabilitas & Responsivitas", "Antarmuka sistem responsif menyesuaikan perangkat pengguna (mobile-first untuk karyawan di smartphone, desktop untuk administrator).", "Dapat diakses optimal melalui Google Chrome, Safari, Firefox, dan Edge."]
        ]
    ));
    bab3.push(createParagraph("", { after: 180 }));

    // --- 3.3 PEMODELAN SISTEM (UNIFIED MODELING LANGUAGE - UML) ---
    bab3.push(createHeading("3.3 Pemodelan Sistem (Unified Modeling Language - UML)", 2));
    bab3.push(createParagraph(
        "Pemodelan sistem berorientasi objek dalam penelitian ini digambarkan menggunakan Unified Modeling Language (UML). Diagram UML yang digunakan mencakup Use Case Diagram beserta skenario use case, Activity Diagram, Sequence Diagram, dan diagram alir (Flowchart) untuk memvisualisasikan interaksi, struktur logika, dan aliran data sistem secara komprehensif."
    ));

    // 3.3.1 Use Case Diagram
    bab3.push(createHeading("3.3.1 Use Case Diagram & Skenario Use Case", 3));
    bab3.push(createParagraph(
        "Sistem Absensi Pegawai melibatkan dua aktor utama, yaitu Karyawan (Employee) dan Administrator (HRD). Karyawan berinteraksi dengan sistem untuk mencatat presensi masuk/pulang, melihat riwayat kehadiran, mengajukan cuti, dan mengelola profil. Sedangkan Administrator memiliki wewenang penuh dalam mengelola data karyawan, memantau kehadiran harian, menyetujui/menolak cuti, serta mengatur koordinat dan radius geofencing kantor."
    ));

    // Tabel 3.4
    bab3.push(createTableCaption("Tabel 3.4", "Matriks Use Case Sistem Absensi Pegawai"));
    bab3.push(createStyledTable(
        ["Kode Use Case", "Nama Use Case", "Aktor Utama", "Deskripsi Singkat"],
        [
            ["UC-01", "Melakukan Otentikasi (Log In / Log Out)", "Karyawan & Admin", "Pengguna memasukkan kredensial email & kata sandi untuk mengakses sistem."],
            ["UC-02", "Melakukan Presensi Masuk (Clock-In)", "Karyawan", "Karyawan merekam jam masuk kerja dengan validasi lokasi geofencing GPS."],
            ["UC-03", "Melakukan Presensi Pulang (Clock-Out)", "Karyawan", "Karyawan merekam jam pulang kerja dengan validasi geofencing GPS."],
            ["UC-04", "Melihat Riwayat Kehadiran Pribadi", "Karyawan", "Karyawan meninjau rekap catatan kehadiran harian yang telah tersimpan."],
            ["UC-05", "Mengajukan Permohonan Cuti", "Karyawan", "Karyawan mengisi form permohonan izin/cuti beserta tanggal dan alasan."],
            ["UC-06", "Mengelola Data Profil Pribadi", "Karyawan", "Karyawan melihat detail profil akun dan departemen kerja."],
            ["UC-07", "Melihat Statistik Dashboard Admin", "Administrator", "Admin melihat ringkasan total staf, kehadiran hari ini, dan cuti pending."],
            ["UC-08", "Mengelola Data Karyawan (CRUD)", "Administrator", "Admin menambah akun baru, melihat daftar staf, mengedit, atau menghapus."],
            ["UC-09", "Melihat & Memfilter Laporan Presensi", "Administrator", "Admin melihat data rekapitulasi kehadiran berdasarkan rentang tanggal & divisi."],
            ["UC-10", "Memproses Pengajuan Cuti (Approve/Reject)", "Administrator", "Admin menyetujui atau menolak permohonan cuti staf berstatus pending."],
            ["UC-11", "Mengonfigurasi Geofencing & Peta Kantor", "Administrator", "Admin menentukan titik koordinat kantor di Leaflet Map dan radius toleransi."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Skenario Use Case Rinci
    bab3.push(createParagraph(
        "Berikut disajikan rincian skenario skripsi untuk use case inti yang menggambarkan interaksi nyata antara pengguna dan sistem:"
    ));

    // Tabel 3.5 Skenario UC-02 Presensi Clock-In
    bab3.push(createTableCaption("Tabel 3.5", "Skenario Use Case Presensi Masuk (Clock-In) dengan Validasi Geofencing"));
    bab3.push(createStyledTable(
        ["Komponen Skenario", "Penjelasan Skenario"],
        [
            ["Nomor & Nama Use Case", "UC-02: Melakukan Presensi Masuk (Clock-In)"],
            ["Aktor", "Karyawan (Employee)"],
            ["Deskripsi", "Proses pencatatan jam masuk kerja karyawan dengan validasi posisi geografis."],
            ["Prekondisi", "Karyawan telah berhasil login ke sistem dan belum melakukan clock-in pada hari berjalan."],
            ["Postkondisi", "Data kehadiran hari ini tersimpan di tabel attendance dengan status 'Hadir' dan jam masuk aktual."],
            ["Alur Normal (Normal Flow)", "1. Karyawan membuka halaman Beranda pada aplikasi mobile.\n2. Sistem menampilkan tombol hijau 'Clock In'.\n3. Karyawan mengklik tombol 'Clock In'.\n4. Sistem meminta izin sensor GPS browser dan menangkap koordinat latitude/longitude perangkat.\n5. Sistem memanggil Server Action untuk menghitung jarak ke koordinat kantor menggunakan rumus Haversine.\n6. Sistem memastikan jarak pengguna berada di dalam radius toleransi kantor (misal <= 100m).\n7. Sistem menyimpan record absensi masuk ke tabel attendance.\n8. Sistem menampilkan notifikasi sukses dan mengubah tombol menjadi 'Clock Out'."],
            ["Alur Alternatif (Alternative Flow)", "4a. Pengguna menolak izin GPS: Sistem membatalkan absensi dan memunculkan notifikasi peringatan 'Akses GPS ditolak. Harap izinkan akses lokasi pada browser'.\n6a. Jarak pengguna melebihi radius kantor: Sistem menolak presensi dan menampilkan peringatan 'Presensi ditolak! Anda berada di luar jangkauan kantor (Jarak: X meter)'."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.6 Skenario UC-05 Pengajuan Cuti
    bab3.push(createTableCaption("Tabel 3.6", "Skenario Use Case Pengajuan Permohonan Cuti Karyawan"));
    bab3.push(createStyledTable(
        ["Komponen Skenario", "Penjelasan Skenario"],
        [
            ["Nomor & Nama Use Case", "UC-05: Mengajukan Permohonan Cuti"],
            ["Aktor", "Karyawan (Employee)"],
            ["Deskripsi", "Proses pengajuan surat izin tidak masuk kerja secara mandiri melalui aplikasi."],
            ["Prekondisi", "Karyawan telah login dan membuka menu Pengajuan Cuti."],
            ["Postkondisi", "Data permohonan cuti baru tersimpan di tabel leaves dengan status awal 'pending'."],
            ["Alur Normal (Normal Flow)", "1. Karyawan memilih jenis cuti (Sakit, Liburan, atau Lainnya).\n2. Karyawan menentukan tanggal mulai dan tanggal selesai izin pada kalender.\n3. Karyawan menuliskan alasan pengajuan cuti pada kolom teks.\n4. Karyawan menekan tombol 'Ajukan Cuti'.\n5. Sistem memvalidasi bahwa tanggal mulai tidak lebih besar dari tanggal selesai.\n6. Sistem menyimpan data pengajuan ke tabel leaves dengan status 'pending'.\n7. Sistem menampilkan pesan konfirmasi bahwa pengajuan berhasil diajukan dan menunggu persetujuan admin."],
            ["Alur Alternatif (Alternative Flow)", "5a. Tanggal mulai lebih besar dari tanggal selesai: Sistem memunculkan notifikasi validasi 'Tanggal mulai harus sebelum tanggal akhir cuti' dan membatalkan penyimpanan data."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.7 Skenario UC-11 Pengaturan Geofencing Kantor
    bab3.push(createTableCaption("Tabel 3.7", "Skenario Use Case Pengaturan Lokasi Kantor dan Radius Geofencing"));
    bab3.push(createStyledTable(
        ["Komponen Skenario", "Penjelasan Skenario"],
        [
            ["Nomor & Nama Use Case", "UC-11: Mengonfigurasi Geofencing & Peta Kantor"],
            ["Aktor", "Administrator (HRD)"],
            ["Deskripsi", "Proses penentuan titik pusat kantor dan penetapan radius jangkauan absensi."],
            ["Prekondisi", "Administrator telah berhasil login dan membuka menu Pengaturan Kantor."],
            ["Postkondisi", "Data konfigurasi lokasi kantor tersimpan di tabel settings dalam format JSON."],
            ["Alur Normal (Normal Flow)", "1. Administrator membuka halaman Pengaturan Kantor.\n2. Sistem menampilkan peta interaktif Leaflet beserta penanda (pin) dan lingkaran radius saat ini.\n3. Administrator menggeser pin lokasi kantor atau mengklik titik baru pada peta.\n4. Sistem memperbarui nilai koordinat latitude dan longitude pada formulir secara otomatis.\n5. Administrator memasukkan besaran angka radius toleransi (misal 100 meter) dan mengaktifkan sakelar geofencing.\n6. Administrator menekan tombol 'Simpan Pengaturan'.\n7. Server Action memperbarui kolom value pada tabel settings.\n8. Sistem memunculkan notifikasi 'Konfigurasi kantor berhasil diperbarui'."],
            ["Alur Alternatif (Alternative Flow)", "5a. Radius bernilai nol atau negatif: Sistem menolak pembaruan data dan mewajibkan angka radius bernilai positif minimal 10 meter."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // GAMBAR 3.1: USE CASE DIAGRAM
    bab3.push(...createDiagramSection(
        "gambar-3-1-use-case-diagram.png",
        "Use Case Diagram Sistem Absensi Pegawai Berbasis Geofencing",
        "Gambar 3.1 di atas menyajikan Use Case Diagram sistem Absensi Pegawai. Diagram ini memodelkan interaksi antara dua aktor utama (Karyawan dan Administrator) dengan use case di dalam batas sistem (system boundary). Hubungan include menghubungkan use case Presensi Masuk (Clock-In) dan Presensi Pulang (Clock-Out) dengan use case Validasi Jarak Geofencing, yang menegaskan bahwa setiap aksi presensi mutlak memerlukan validasi lokasi berbasis rumus Haversine.",
        "3.1",
        500,
        360
    ));

    // 3.3.2 Activity Diagram
    bab3.push(createHeading("3.3.2 Activity Diagram", 3));
    bab3.push(createParagraph(
        "Activity Diagram memodelkan aliran aktivitas dinamis dari alur kerja sistem, bagaimana sistem merespon input pengguna, serta bagaimana eksekusi logika berpindah antar-entitas (swimlane). Pada sistem Absensi Pegawai dirancang diagram alur aktivitas untuk presensi geofencing dan eskalasi izin cuti:"
    ));

    // GAMBAR 3.2: ACTIVITY DIAGRAM PRESENSI
    bab3.push(...createDiagramSection(
        "gambar-3-2-activity-diagram-presensi.png",
        "Activity Diagram Presensi Masuk (Clock-In) dengan Validasi Geofencing",
        "Gambar 3.2 menggambarkan aliran aktivitas dinamis proses presensi masuk mandiri karyawan dengan 4 swimlane entitas (Karyawan, Browser/Client UI, Server Actions Backend, dan Database PostgreSQL). Alur memvisualisasikan bagaimana penangkapan koordinat GPS dari browser diverifikasi ke database melalui Server Action dan dievaluasi terhadap batas radius kantor menggunakan rumus Haversine.",
        "3.2",
        480,
        422
    ));

    // GAMBAR 3.3: ACTIVITY DIAGRAM CUTI
    bab3.push(...createDiagramSection(
        "gambar-3-3-activity-diagram-cuti.png",
        "Activity Diagram Pengajuan dan Persetujuan Cuti Karyawan",
        "Gambar 3.3 memaparkan alur kerja pengajuan izin cuti mandiri oleh karyawan dan proses eskalasi persetujuan (approval/rejection) oleh administrator. Transaksi status cuti langsung disinkronisasi secara dua arah sehingga karyawan dapat memantau status pengajuannya secara transparan.",
        "3.3",
        480,
        380
    ));

    // 3.3.3 Sequence Diagram
    bab3.push(createHeading("3.3.3 Sequence Diagram", 3));
    bab3.push(createParagraph(
        "Sequence Diagram mendokumentasikan interaksi pesan (message passing) antar-objek perangkat lunak berdasarkan kronologi urutan waktu:"
    ));

    // GAMBAR 3.4: SEQUENCE DIAGRAM PRESENSI
    bab3.push(...createDiagramSection(
        "gambar-3-4-sequence-diagram-presensi.png",
        "Sequence Diagram Alur Presensi Masuk (Clock-In) Karyawan",
        "Gambar 3.4 mendokumentasikan urutan pesan sinkron dan asinkron antar-objek perangkat lunak pada saat karyawan mengeksekusi presensi masuk. Diagram ini memperlihatkan pemisahan tanggung jawab yang tegas antara presentation layer (AttendanceCard), browser geolocation API, application logic (clockIn Server Action), mathematical engine (calculateDistance), dan data layer (Drizzle ORM & PostgreSQL).",
        "3.4",
        500,
        362
    ));

    // 3.3.4 Flowchart Logika Bisnis Sistem
    bab3.push(createHeading("3.3.4 Flowchart Logika Bisnis Sistem (Algoritma Geofencing)", 3));
    bab3.push(createParagraph(
        "Diagram alir (Flowchart) digunakan untuk memperjelas alur percabangan keputusan logika dalam algoritma validasi geofencing presensi karyawan:"
    ));

    // GAMBAR 3.5: FLOWCHART GEOFENCING
    bab3.push(...createDiagramSection(
        "gambar-3-5-flowchart-geofencing.png",
        "Flowchart Algoritma Validasi Geofencing Rumus Haversine",
        "Gambar 3.5 menyajikan diagram alir (flowchart) logika keputusan algoritma geofencing berbasis rumus Haversine. Diagram ini menguraikan tahapan mulai dari pemeriksaan izin sensor GPS, perhitungan trigonometri kuadrat setengah tali busur lingkaran besar bola bumi, hingga pencabangan keputusan penerimaan atau penolakan transaksi presensi di database.",
        "3.5",
        420,
        508
    ));

    // --- 3.4 PERANCANGAN ARSITEKTUR SISTEM ---
    bab3.push(createHeading("3.4 Perancangan Arsitektur Sistem", 2));
    bab3.push(createParagraph(
        "Sistem Absensi Pegawai dirancang menggunakan arsitektur full-stack modern berbasis Next.js App Router dalam satu kesatuan basis kode terpadu (monorepo). Pola arsitektur ini mengeliminasi kebutuhan pembuatan web service REST API terpisah, karena komunikasi antara antarmuka pengguna dan logika backend dijembatani langsung oleh Next.js Server Actions yang dieksekusi secara aman di lingkungan server."
    ));

    bab3.push(createParagraph(
        "Arsitektur sistem dibagi menjadi 4 (empat) lapisan (layers) independen yang saling terintegrasi:"
    ));

    bab3.push(createBulletItem("1. Presentation Layer (Lapisan Antarmuka): Dibangun menggunakan React 19 dan Next.js Client Components. Bertanggung jawab menangani rendering antarmuka pengguna, mendeteksi interaksi pengguna, mengakses API sensor peramban (Navigator Geolocation), dan menyajikan visualisasi data responsif dengan Tailwind CSS, shadcn/ui, serta peta interaktif Leaflet."));
    bab3.push(createBulletItem("2. Application & Business Logic Layer (Lapisan Logika Bisnis): Berisi Next.js Server Components dan Server Actions (src/actions/). Lapisan ini memproses logika bisnis inti, seperti kalkulasi jarak geofencing, verifikasi rentang tanggal pengajuan cuti, perhitungan agregasi statistik kehadiran, dan proteksi rute halaman menggunakan Next.js Middleware."));
    bab3.push(createBulletItem("3. Security & Authentication Layer (Lapisan Keamanan): Ditenagai oleh pustaka Better Auth dan modul enkripsi Bcrypt. Mengelola pembuatan token sesi login aman berbasis cookie Http-Only, hashing kata sandi pengguna, serta penegakan aturan hak akses berbasis peran (Role-Based Access Control)."));
    bab3.push(createBulletItem("4. Data Persistence Layer (Lapisan Penyimpanan Data): Dikelola menggunakan Drizzle ORM sebagai jembatan pemetaan objek-relasional bertipe aman (Type-Safe ORM) menuju basis data relasional PostgreSQL yang di-hosting pada infrastruktur komputasi awan Supabase."));

    // --- 3.5 PERANCANGAN ALGORITMA GEOFENCING (RUMUS HAVERSINE) ---
    bab3.push(createHeading("3.5 Perancangan Algoritma Geofencing (Rumus Haversine)", 2));
    bab3.push(createParagraph(
        "Geofencing merupakan teknologi pembatasan geografis virtual pada area dunia nyata. Untuk menentukan apakah posisi seorang karyawan berada di dalam batas perimeter area kantor atau berada di luar kantor, sistem menggunakan formulasi matematika rumus Haversine (Haversine Formula). Rumus Haversine adalah persamaan navigasi penting yang menghitung jarak lingkaran besar (Great-Circle Distance) antara dua titik koordinat pada permukaan bola bumi berdasarkan garis lintang (latitude) dan garis bujur (longitude)."
    ));

    bab3.push(createParagraph(
        "Formulasi matematis rumus Haversine dinyatakan dalam persamaan trigonometri sebagai berikut:"
    ));

    // Rumus Matematika Haversine
    bab3.push(createParagraph(
        "a = sin²(Δφ / 2) + cos(φ1) * cos(φ2) * sin²(Δλ / 2)",
        { alignment: AlignmentType.CENTER, bold: true, after: 60 }
    ));
    bab3.push(createParagraph(
        "c = 2 * atan2( √a, √(1 - a) )",
        { alignment: AlignmentType.CENTER, bold: true, after: 60 }
    ));
    bab3.push(createParagraph(
        "d = R * c",
        { alignment: AlignmentType.CENTER, bold: true, after: 120 }
    ));

    bab3.push(createParagraph(
        "Keterangan variabel formulasi Haversine:\n" +
        "• d  = Jarak linear antara titik kantor dan titik perangkat pengguna (dalam satuan meter).\n" +
        "• R  = Jari-jari rata-rata planet bumi, yaitu 6.371.000 meter (atau 6.371 kilometer).\n" +
        "• φ1 = Garis lintang (latitude) titik pusat kantor (dikonversi ke radian).\n" +
        "• φ2 = Garis lintang (latitude) posisi aktual perangkat karyawan (dikonversi ke radian).\n" +
        "• Δφ = Selisih garis lintang (φ2 - φ1 dalam radian).\n" +
        "• Δλ = Selisih garis bujur (longitude) (λ2 - λ1 dalam radian).\n" +
        "• Konversi satuan dari derajat ke radian dihitung dengan perkalian: radian = derajat * (π / 180)."
    ));

    bab3.push(createParagraph(
        "Kondisi evaluasi validasi geofencing pada sistem dinyatakan dengan aturan logika:"
    ));
    bab3.push(createBulletItem("Jika d <= Radius_Toleransi, maka Status = VALID (Presensi Diterima dan Dicatat)."));
    bab3.push(createBulletItem("Jika d > Radius_Toleransi, maka Status = INVALID (Presensi Ditolak, Notifikasi Di Luar Jangkauan)."));

    // Simulasi Numerik Riil
    bab3.push(createParagraph(
        "Untuk membuktikan keakuratan matematis algoritma Haversine yang dirancang, berikut disajikan simulasi numerik pengujian koordinat riil dengan konfigurasi titik kantor pada koordinat Latitude -6.208800 dan Longitude 106.845600 serta batas toleransi radius 100 meter:"
    ));

    // Tabel 3.8
    bab3.push(createTableCaption("Tabel 3.8", "Simulasi Perhitungan Jarak Geofencing dengan Rumus Haversine"));
    bab3.push(createStyledTable(
        ["Skenario Uji", "Koordinat Karyawan (Lat, Lng)", "Jarak Terhitung (d)", "Radius Batas", "Keputusan Sistem"],
        [
            ["Karyawan A (Di Meja Kerja Kantor)", "-6.208820, 106.845610", "2,5 meter", "100 meter", "VALID (Presensi Berhasil)"],
            ["Karyawan B (Di Area Parkir Kantor)", "-6.208950, 106.845700", "20,1 meter", "100 meter", "VALID (Presensi Berhasil)"],
            ["Karyawan C (Di Gerbang Depan Kantor)", "-6.209300, 106.845900", "64,7 meter", "100 meter", "VALID (Presensi Berhasil)"],
            ["Karyawan D (Di Halte Luar Kantor)", "-6.210000, 106.846500", "165,3 meter", "100 meter", "DITOLAK (Di Luar Jangkauan)"],
            ["Karyawan E (Di Rumah Karyawan)", "-6.225000, 106.860000", "2.408 meter", "100 meter", "DITOLAK (Di Luar Jangkauan)"]
        ]
    ));
    bab3.push(createParagraph("", { after: 180 }));

    // --- 3.6 PERANCANGAN BASIS DATA (DATABASE DESIGN) ---
    bab3.push(createHeading("3.6 Perancangan Basis Data (Database Design)", 2));
    bab3.push(createParagraph(
        "Perancangan basis data relasional bertujuan untuk menstrukturkan penyimpanan data transaksi presensi, data pengguna, riwayat cuti, dan konfigurasi kantor agar memenuhi prinsip integritas data, bebas dari anomali redundansi, dan konsisten."
    ));

    // 3.6.1 ERD
    bab3.push(createHeading("3.6.1 Entity Relationship Diagram (ERD)", 3));
    bab3.push(createParagraph(
        "Struktur Entity Relationship Diagram (ERD) sistem Absensi Pegawai memetakan relasi antar entitas sebagai berikut:"
    ));
    bab3.push(createBulletItem("Entitas 'user' memiliki relasi One-to-Many (1:N) terhadap entitas 'attendance', di mana satu pengguna karyawan dapat memiliki banyak catatan riwayat presensi harian."));
    bab3.push(createBulletItem("Entitas 'user' memiliki relasi One-to-Many (1:N) terhadap entitas 'leaves', di mana satu karyawan dapat mengajukan banyak permohonan cuti."));
    bab3.push(createBulletItem("Entitas 'user' memiliki relasi One-to-Many (1:N) terhadap entitas 'session' dan 'account' untuk pengelolaan sesi dan otentikasi login Better Auth dengan mekanisme cascading delete (penghapusan akun karyawan akan otomatis membersihkan seluruh data relasinya)."));
    bab3.push(createBulletItem("Entitas 'settings' bertindak sebagai entitas konfigurasi mandiri yang menyimpan parameter global kantor dalam bentuk format key-value JSON stringified."));
    bab3.push(createBulletItem("Entitas 'verification' bertindak sebagai entitas pembantu manajemen verifikasi akun dan reset kata sandi."));

    // GAMBAR 3.6: ERD DATABASE
    bab3.push(...createDiagramSection(
        "gambar-3-6-erd-database.png",
        "Entity Relationship Diagram (ERD) Basis Data Sistem Absensi Pegawai",
        "Gambar 3.6 memvisualisasikan struktur konseptual dan logikal Entity Relationship Diagram (ERD) basis data sistem Absensi Pegawai. Diagram ini memperlihatkan keterhubungan relasi One-to-Many (1:N) antara entitas user terhadap attendance, leaves, session, dan account, serta entitas independen settings untuk konfigurasi koordinat dan radius kantor.",
        "3.6",
        500,
        350
    ));

    // 3.6.2 Kamus Data
    bab3.push(createHeading("3.6.2 Kamus Data Struktur Tabel (Data Dictionary)", 3));
    bab3.push(createParagraph(
        "Kamus data merinci spesifikasi atribut kolom, tipe data, kunci (Primary Key / Foreign Key), serta deskripsi fungsinya pada basis data PostgreSQL:"
    ));

    // Tabel 3.9 User
    bab3.push(createTableCaption("Tabel 3.9", "Kamus Data Tabel Pengguna (user)"));
    bab3.push(createStyledTable(
        ["Nama Kolom", "Tipe Data", "Constraint", "Keterangan Fungsi"],
        [
            ["id", "Text", "Primary Key", "Pengenal unik akun pengguna berupa UUID string."],
            ["name", "Text", "Not Null", "Nama lengkap karyawan atau administrator."],
            ["email", "Text", "Unique, Not Null", "Alamat surel untuk identifikasi login sistem."],
            ["emailVerified", "Boolean", "Default: false", "Status verifikasi alamat surel pengguna."],
            ["image", "Text", "Nullable", "URL foto profil pengguna."],
            ["role", "Text (Enum)", "Default: 'employee'", "Peran hak akses akun ('admin' atau 'employee')."],
            ["department", "Text", "Nullable", "Nama divisi atau departemen tempat bertugas."],
            ["banned", "Boolean", "Default: false", "Status pemblokiran akun pengguna."],
            ["banReason", "Text", "Nullable", "Alasan pemblokiran akses akun."],
            ["banExpires", "Timestamp", "Nullable", "Batas waktu berakhirnya sanksi pemblokiran."],
            ["createdAt", "Timestamp", "Default: Now()", "Catatan waktu pembuatan akun pertama kali."],
            ["updatedAt", "Timestamp", "Default: Now()", "Catatan waktu pembaruan profil terakhir."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.10 Attendance
    bab3.push(createTableCaption("Tabel 3.10", "Kamus Data Tabel Kehadiran (attendance)"));
    bab3.push(createStyledTable(
        ["Nama Kolom", "Tipe Data", "Constraint", "Keterangan Fungsi"],
        [
            ["id", "Serial", "Primary Key", "Auto-increment ID catatan presensi."],
            ["userId", "Text", "Foreign Key -> user(id)", "Menghubungkan record presensi ke id karyawan bersangkutan."],
            ["date", "Timestamp", "Default: Now()", "Tanggal presensi harian dicatat."],
            ["checkInTime", "Timestamp", "Nullable", "Waktu detik aktual karyawan melakukan clock-in."],
            ["checkOutTime", "Timestamp", "Nullable", "Waktu detik aktual karyawan melakukan clock-out."],
            ["status", "Text (Enum)", "Nullable", "Status presensi: 'present' (hadir), 'late' (terlambat), 'absent'."],
            ["latitude", "Double Precision", "Nullable", "Koordinat garis lintang GPS perangkat saat presensi."],
            ["longitude", "Double Precision", "Nullable", "Koordinat garis bujur GPS perangkat saat presensi."],
            ["notes", "Text", "Nullable", "Catatan tambahan atau keterangan anomali kehadiran."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.11 Leaves
    bab3.push(createTableCaption("Tabel 3.11", "Kamus Data Tabel Permohonan Cuti (leaves)"));
    bab3.push(createStyledTable(
        ["Nama Kolom", "Tipe Data", "Constraint", "Keterangan Fungsi"],
        [
            ["id", "Serial", "Primary Key", "Auto-increment ID permohonan cuti."],
            ["userId", "Text", "Foreign Key -> user(id)", "ID karyawan yang mengajukan izin cuti."],
            ["type", "Text (Enum)", "Not Null", "Kategori izin: 'sick' (sakit), 'vacation' (liburan), 'other'."],
            ["startDate", "Timestamp", "Not Null", "Tanggal awal masa berlakunya cuti."],
            ["endDate", "Timestamp", "Not Null", "Tanggal akhir masa berlakunya cuti."],
            ["status", "Text (Enum)", "Default: 'pending'", "Status persetujuan: 'pending', 'approved', 'rejected'."],
            ["reason", "Text", "Not Null", "Alasan tertulis pengajuan cuti oleh karyawan."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.12 Settings
    bab3.push(createTableCaption("Tabel 3.12", "Kamus Data Tabel Pengaturan Global (settings)"));
    bab3.push(createStyledTable(
        ["Nama Kolom", "Tipe Data", "Constraint", "Keterangan Fungsi"],
        [
            ["key", "Text", "Primary Key", "Kunci identifikasi parameter konfigurasi (e.g. 'office_config')."],
            ["value", "Text", "Not Null", "Nilai konfigurasi berupa string JSON (lat, lng, radius, enabled)."],
            ["updatedAt", "Timestamp", "Default: Now()", "Waktu pembaruan konfigurasi kantor terakhir."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    // Tabel 3.13 Session, Account, Verification
    bab3.push(createTableCaption("Tabel 3.13", "Kamus Data Tabel Otentikasi & Keamanan (Better Auth)"));
    bab3.push(createStyledTable(
        ["Nama Tabel", "Nama Kolom", "Tipe Data", "Keterangan Fungsi"],
        [
            ["session", "id", "Text (PK)", "ID unik sesi login aktif."],
            ["session", "userId", "Text (FK -> user.id)", "Relasi ke pengguna pemilik sesi aktif."],
            ["session", "token", "Text (Unique)", "Token acak sesi yang disimpan di browser cookie Http-Only."],
            ["session", "expiresAt", "Timestamp", "Batas waktu kadaluarsa sesi login pengguna."],
            ["account", "id", "Text (PK)", "ID unik data kredensial akun."],
            ["account", "userId", "Text (FK -> user.id)", "Relasi kepemilikan kredensial ke user(id)."],
            ["account", "password", "Text", "Nilai kata sandi yang telah di-hash dengan Bcrypt."],
            ["verification", "id", "Text (PK)", "ID pengajuan verifikasi token reset kata sandi."]
        ]
    ));
    bab3.push(createParagraph("", { after: 180 }));

    // --- 3.7 PERANCANGAN ANTARMUKA SISTEM (PROTOTYPE DESIGN) ---
    bab3.push(createHeading("3.7 Perancangan Antarmuka Sistem (Prototype Design)", 2));
    bab3.push(createParagraph(
        "Perancangan antarmuka (User Interface Design) sistem Absensi Pegawai dibangun melalui pendekatan Prototyping yang menitikberatkan pada dua prinsip utama: Mobile-First Responsive Design untuk modul karyawan dan Enterprise Administrative Dashboard untuk modul administrator. Rancangan antarmuka ini dirancang untuk memberikan pengalaman pengguna (User Experience) yang bersih, intuitif, dan responsif."
    ));

    // 3.7.1 Simulasi Desain Prototype Antarmuka Mobile Karyawan
    bab3.push(createHeading("3.7.1 Simulasi Desain Prototype Antarmuka Mobile Karyawan", 3));
    bab3.push(createParagraph(
        "Rancangan prototype antarmuka mobile dirancang khusus dengan pendekatan Mobile-First Responsive Design untuk mempermudah operasional absensi pegawai di lokasi kerja secara fleksibel melalui layar smartphone:"
    ));

    // GAMBAR 3.7: PROTOTYPE MOBILE PRESENSI
    bab3.push(...createDiagramSection(
        "gambar-3-7-prototype-mobile-presensi.png",
        "Simulasi Desain Prototype Antarmuka Mobile Beranda & Presensi Karyawan",
        "Gambar 3.7 menyajikan simulasi rancangan prototype antarmuka beranda karyawan pada bingkai ponsel pintar. Rancangan memuat penunjuk waktu real-time, kartu status kehadiran hari ini, tombol aksi presensi berukuran besar 'CLOCK IN MASUK' yang dinamis, indikator deteksi koordinat GPS live, serta bilah navigasi bawah (bottom navigation bar).",
        "3.7",
        240,
        416
    ));

    // GAMBAR 3.8: PROTOTYPE MOBILE CUTI
    bab3.push(...createDiagramSection(
        "gambar-3-8-prototype-mobile-cuti.png",
        "Simulasi Desain Prototype Antarmuka Mobile Formulir Pengajuan Cuti Mandiri",
        "Gambar 3.8 menyajikan simulasi rancangan prototype formulir pengajuan cuti mandiri pada perangkat seluler. Form dirancang dengan komponen pemilih jenis cuti (dropdown), penentu rentang tanggal kalender terpadu, kolom alasan permohonan, tombol kirim, serta kartu pratinjau status permohonan cuti terakhir (pending review).",
        "3.8",
        240,
        416
    ));

    // 3.7.2 Simulasi Desain Prototype Antarmuka Desktop Administrator
    bab3.push(createHeading("3.7.2 Simulasi Desain Prototype Antarmuka Desktop Administrator", 3));
    bab3.push(createParagraph(
        "Rancangan prototype antarmuka desktop dirancang untuk memenuhi kebutuhan staf HRD dalam memantau dan mengelola operasional perusahaan pada layar komputer (desktop view) dengan tata letak sidebar navigasi tetap di bagian kiri:"
    ));

    // GAMBAR 3.9: PROTOTYPE DESKTOP ADMIN
    bab3.push(...createDiagramSection(
        "gambar-3-9-prototype-desktop-admin.png",
        "Simulasi Desain Prototype Antarmuka Desktop Dashboard Statistik Administrator",
        "Gambar 3.9 menampilkan simulasi rancangan prototype dashboard administrator pada bingkai peramban desktop. Dasbor ini memuat bilah navigasi sidebar kiri tetap, 3 kartu indikator metrik utama (Total Karyawan, Hadir Hari Ini, dan Cuti Pending), serta tabel ringkasan aktivitas kehadiran harian staf secara terperinci.",
        "3.9",
        500,
        323
    ));

    // GAMBAR 3.10: PROTOTYPE DESKTOP GEOFENCING
    bab3.push(...createDiagramSection(
        "gambar-3-10-prototype-desktop-geofencing.png",
        "Simulasi Desain Prototype Antarmuka Desktop Konfigurasi Geofencing & Peta Leaflet",
        "Gambar 3.10 menyajikan simulasi rancangan prototype antarmuka konfigurasi geofencing kantor. Rancangan mengintegrasikan peta digital interaktif Leaflet dengan penanda pin lokasi kantor pusat yang dapat digeser secara visual, visualisasi lingkaran radius toleransi absensi (100 meter), form koordinat latitude/longitude, slider besaran radius, sakelar aktivasi geofencing, dan tombol simpan konfigurasi.",
        "3.10",
        500,
        323
    ));

    // 3.7.3 Evaluasi Prototype oleh Pengguna
    bab3.push(createHeading("3.7.3 Evaluasi Prototype oleh Pengguna dan Rekomendasi Iterasi", 3));
    bab3.push(createParagraph(
        "Terdapat 10 (sepuluh) rancangan prototype antarmuka sistem yang dikembangkan dan dievaluasi dalam penelitian ini:"
    ));

    // Tabel 3.14 Pemetaan Desain Prototype
    bab3.push(createTableCaption("Tabel 3.14", "Pemetaan Desain Prototype Antarmuka Sistem"));
    bab3.push(createStyledTable(
        ["No", "Nama Rancangan Prototype", "Target Pengguna", "Pendekatan Layout & Komponen Kunci"],
        [
            ["1", "Prototype Halaman Masuk (Login)", "Universal (Semua User)", "Desain kartu terpusat di tengah layar, form email/password, proteksi Zod."],
            ["2", "Prototype Beranda Presensi", "Karyawan", "Mobile view: kartu status kehadiran, tombol dinamis Clock In / Clock Out."],
            ["3", "Prototype Riwayat Kehadiran", "Karyawan", "Mobile view: daftar kartu riwayat tanggal, waktu, dan badge status hadir."],
            ["4", "Prototype Pengajuan Cuti Mandiri", "Karyawan", "Mobile view: dropdown tipe cuti, pemilih tanggal kalender, textarea alasan."],
            ["5", "Prototype Profil Pengguna", "Karyawan", "Mobile view: kartu informasi profil akun, departemen, dan tombol Log Out."],
            ["6", "Prototype Dashboard Statistik", "Administrator", "Desktop view: sidebar menu tetap, 3 KPI card statistik, tabel kehadiran real-time."],
            ["7", "Prototype Manajemen Karyawan", "Administrator", "Desktop view: tabel data akun staf, fitur pencarian, modal form tambah/edit."],
            ["8", "Prototype Laporan Rekapitulasi", "Administrator", "Desktop view: filter interaktif tanggal mulai/akhir, filter departemen, tabel rekap."],
            ["9", "Prototype Persetujuan Cuti", "Administrator", "Desktop view: tabel eskalasi cuti pending, tombol aksi 'Setujui' dan 'Tolak'."],
            ["10", "Prototype Pengaturan Geofencing", "Administrator", "Desktop view: peta interaktif Leaflet, marker kantor, slider radius meter."]
        ]
    ));
    bab3.push(createParagraph("", { after: 120 }));

    bab3.push(createParagraph(
        "Hasil rancangan prototype tersebut kemudian diuji coba dan dievaluasi bersama calon pengguna (staf HRD dan karyawan). Masukan yang diperoleh menyatakan bahwa rancangan antarmuka mobile karyawan sangat mudah dipahami karena penempatan tombol presensi yang besar dan menonjol, sedangkan antarmuka admin sangat memudahkan pengawasan operasional berkat visualisasi lingkaran radius pada peta Leaflet. Seluruh rancangan prototype ini disetujui tanpa perubahan struktural besar dan dijadikan acuan mutlak pada tahap implementasi sistem yang dipaparkan pada Bab IV."
    ));

    return bab3;
}

// ==========================================
// FUNGSI PEMBANGUN KONTEN BAB IV: HASIL DAN PEMBAHASAN
// ==========================================
function buildBab4() {
    const bab4 = [];

    // --- HEADING BAB IV ---
    // Gunakan pageBreakBefore: true agar BAB IV otomatis berada di halaman baru setelah BAB III
    bab4.push(createHeading("BAB IV", 1, { pageBreakBefore: true }));
    bab4.push(createHeading("HASIL DAN PEMBAHASAN", 1, { before: 120, after: 480 }));

    // Pengantar Bab IV
    bab4.push(createParagraph(
        "Bab ini menyajikan hasil implementasi sistem, pengujian fungsionalitas aplikasi, serta pembahasan mendalam terhadap hasil penelitian sistem Absensi Pegawai yang telah dirancang pada Bab III. Tahap implementasi mendeskripsikan spesifikasi lingkungan pengembangan, implementasi skema basis data menggunakan Drizzle ORM, realisasi kode logika bisnis Server Actions untuk validasi geofencing dengan rumus Haversine, serta perwujudan 10 halaman antarmuka pengguna hasil realisasi prototype yang telah di-deploy secara daring (online). Selanjutnya, disajikan hasil pengujian fungsional menggunakan metode Black-box testing, dilanjutkan dengan pembahasan komprehensif mengenai efektivitas algoritma geofencing, evaluasi penerapan metodologi prototyping, serta efisiensi arsitektur full-stack Next.js yang dibangun."
    ));

    // --- 4.1 LINGKUNGAN IMPLEMENTASI SISTEM ---
    bab4.push(createHeading("4.1 Lingkungan Implementasi Sistem", 2));
    bab4.push(createParagraph(
        "Pembangunan, implementasi, dan pengujian sistem Absensi Pegawai dijalankan pada lingkungan perangkat keras (hardware) dan perangkat lunak (software) dengan spesifikasi teknis yang disajikan pada Tabel 4.1 berikut:"
    ));

    // Tabel 4.1
    bab4.push(createTableCaption("Tabel 4.1", "Spesifikasi Lingkungan Implementasi Perangkat Keras dan Perangkat Lunak"));
    bab4.push(createStyledTable(
        ["Komponen", "Kategori Lingkungan", "Spesifikasi Teknis yang Digunakan"],
        [
            ["Perangkat Keras Pengembangan", "Hardware (PC / Laptop)", "AMD Ryzen 5 / Intel Core i5, RAM 16 GB DDR4, SSD 512 GB NVMe."],
            ["Perangkat Keras Pengujian Mobile", "Hardware (Smartphone)", "Smartphone Android (GPS Multi-GNSS) & iPhone iOS (Apple Geolocation)."],
            ["Sistem Operasi", "Software Sistem", "Microsoft Windows 11 Home 64-bit."],
            ["Lingkungan Eksekusi (Runtime)", "Software Backend", "Node.js versi 20.x (LTS Engine)."],
            ["Framework Pengembangan", "Software Framework", "Next.js versi 15 / 16 (App Router Architecture, React 19, TypeScript)."],
            ["Database Server", "Software Basis Data", "PostgreSQL versi 15 Cloud Server (Dikelola via Supabase)."],
            ["Object-Relational Mapping", "Software Data Layer", "Drizzle ORM versi 0.45 & Drizzle Kit versi 0.31."],
            ["Mesin Otentikasi & Keamanan", "Software Security", "Better Auth versi 1.4 & Algoritma Enkripsi Bcryptjs."],
            ["Styling & Antarmuka Komponen", "Software UI Library", "Tailwind CSS v4, shadcn/ui Component Suite, & Lucide React."],
            ["Pemetaan Geografis Digital", "Software Geolocation", "Leaflet JS versi 1.9 & React Leaflet versi 5.0."],
            ["Lingkungan Pengembangan (IDE)", "Software Tools", "Visual Studio Code dengan ekstensi TypeScript & Drizzle."],
            ["Infrastruktur Deployment Cloud", "Software Hosting", "Vercel Cloud Production Platform (Domain: https://absensi-karyawan-three.vercel.app)."]
        ]
    ));
    bab4.push(createParagraph("", { after: 180 }));

    // --- 4.2 IMPLEMENTASI BASIS DATA ---
    bab4.push(createHeading("4.2 Implementasi Basis Data", 2));
    bab4.push(createParagraph(
        "Implementasi basis data dilakukan dengan menerjemahkan rancangan skema tabel dan kamus data pada Bab III ke dalam definisi kode TypeScript menggunakan Drizzle ORM pada file src/db/schema.ts. Pendekatan ini menjamin tipe data yang konsisten dan aman (Type Safety) antara kode logika aplikasi dan basis data relasional PostgreSQL Supabase."
    ));

    // Kode Skema DB
    const schemaCode = `import { pgTable, serial, text, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').$type<'admin' | 'employee'>().default('employee'),
  department: text('department'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const attendances = pgTable('attendance', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  date: timestamp('date').defaultNow(),
  checkInTime: timestamp('check_in_time'),
  checkOutTime: timestamp('check_out_time'),
  status: text('status').$type<'present' | 'late' | 'absent'>(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
});

export const leaves = pgTable('leaves', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  type: text('type').$type<'sick' | 'vacation' | 'other'>().notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').$type<'pending' | 'approved' | 'rejected'>().default('pending').notNull(),
  reason: text('reason').notNull(),
});

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});`;

    bab4.push(createCodeBlock(schemaCode));
    bab4.push(createParagraph("", { after: 120 }));
    bab4.push(createParagraph(
        "Setelah skema didefinisikan, sinkronisasi struktur tabel ke database cloud Supabase dieksekusi menggunakan perintah Drizzle Kit CLI ('drizzle-kit push'). Perintah ini secara otomatis menghasilkan tabel-tabel relasional di PostgreSQL tanpa perlu menulis sintaks DDL SQL manual."
    ));

    // --- 4.3 IMPLEMENTASI LOGIKA BISNIS & SERVER ACTIONS ---
    bab4.push(createHeading("4.3 Implementasi Logika Bisnis & Server Actions", 2));
    bab4.push(createParagraph(
        "Seluruh pemrosesan logika bisnis, validasi jarak geofencing, pencatatan presensi, dan eskalasi izin cuti ditulis menggunakan Next.js Server Actions. Server Actions mengeksekusi kode di lingkungan backend server secara terproteksi, sehingga kredensial basis data dan algoritma perhitungan jarak tidak dapat dimanipulasi dari sisi peramban klien."
    ));

    // 4.3.1 Implementasi Algoritma Haversine
    bab4.push(createHeading("4.3.1 Implementasi Algoritma Haversine (src/lib/geolocation/index.ts)", 3));
    bab4.push(createParagraph(
        "Realisasi algoritma Haversine untuk menghitung jarak linear antara titik koordinat kantor dan posisi koordinat karyawan dikodekan dalam bahasa TypeScript sebagai berikut:"
    ));

    const haversineCode = `export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radius rata-rata bumi = 6.371.000 meter
  const φ1 = (lat1 * Math.PI) / 180; // Konversi latitude kantor ke radian
  const φ2 = (lat2 * Math.PI) / 180; // Konversi latitude pengguna ke radian
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Selisih latitude
  const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Selisih longitude

  // Formulasi kuadrat setengah tali busur lingkaran besar
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  // Jarak sudut dalam radian
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Hasil akhir jarak dalam satuan meter
}`;
    bab4.push(createCodeBlock(haversineCode));
    bab4.push(createParagraph("", { after: 120 }));

    // 4.3.2 Server Action Presensi Karyawan
    bab4.push(createHeading("4.3.2 Implementasi Server Action Presensi Masuk (src/actions/attendance.ts)", 3));
    bab4.push(createParagraph(
        "Server Action presensi clock-in menerima parameter koordinat latitude dan longitude dari perangkat karyawan, memverifikasi sesi login aktif, membaca batas radius kantor dari tabel settings, dan memvalidasi jarak Haversine sebelum menyimpan presensi:"
    ));

    const clockInCode = `export async function clockIn(lat: number, lng: number) {
  try {
    // 1. Verifikasi Sesi Login
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Unauthorized" };

    // 2. Baca Konfigurasi Lokasi & Geofencing Kantor
    const config = await getOfficeConfig();
    if (config.enabled) {
      const distance = calculateDistance(lat, lng, config.latitude, config.longitude);
      // Jika jarak melebihi batas radius toleransi, tolak absensi
      if (distance > config.radius) {
        return {
          success: false,
          message: \`Di luar jangkauan kantor! Jarak Anda: \${distance.toFixed(0)}m (Maksimal: \${config.radius}m).\`
        };
      }
    }

    // 3. Pastikan belum melakukan absensi masuk pada hari yang sama
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await db.select()
      .from(attendances)
      .where(and(
        eq(attendances.userId, session.user.id),
        gte(attendances.date, today),
        lte(attendances.date, tomorrow)
      ));

    if (existingAttendance.length > 0) {
      return { success: false, message: "Anda sudah melakukan presensi masuk hari ini" };
    }

    // 4. Simpan Record Presensi ke Database PostgreSQL
    await db.insert(attendances).values({
      userId: session.user.id,
      date: new Date(),
      checkInTime: new Date(),
      latitude: lat,
      longitude: lng,
      status: 'present'
    });

    return { success: true, message: "Presensi masuk berhasil dicatat!" };
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan saat memproses absensi" };
  }
}`;
    bab4.push(createCodeBlock(clockInCode));
    bab4.push(createParagraph("", { after: 120 }));

    // 4.3.3 Server Action Pengajuan Cuti
    bab4.push(createHeading("4.3.3 Implementasi Server Action Pengajuan Cuti (src/actions/leave.ts)", 3));
    bab4.push(createParagraph(
        "Server Action pengajuan cuti memvalidasi keabsahan kronologis tanggal mulai dan tanggal selesai serta memasukkan data permohonan ke tabel leaves dengan status awal 'pending':"
    ));

    const leaveCode = `export async function requestLeave(
  type: 'sick' | 'vacation' | 'other',
  startDate: Date,
  endDate: Date,
  reason: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Unauthorized" };

    if (startDate > endDate) {
      return { success: false, message: "Tanggal mulai harus sebelum tanggal akhir cuti" };
    }

    const newLeave = await db.insert(leaves).values({
      userId: session.user.id,
      type,
      startDate,
      endDate,
      reason,
      status: 'pending'
    }).returning();

    return { success: true, message: "Permohonan cuti berhasil diajukan", leave: newLeave[0] };
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan saat mengajukan cuti" };
  }
}`;
    bab4.push(createCodeBlock(leaveCode));
    bab4.push(createParagraph("", { after: 180 }));

    // --- 4.4 IMPLEMENTASI HALAMAN ANTARMUKA SISTEM (REALISASI PROTOTYPE) ---
    bab4.push(createHeading("4.4 Implementasi Halaman Antarmuka Sistem (Hasil Realisasi Prototype)", 2));
    bab4.push(createParagraph(
        "Berikut merupakan hasil realisasi antarmuka pengguna (User Interface) aplikasi Absensi Pegawai yang dikembangkan berdasarkan rancangan prototype pada Bab III. Sistem telah di-deploy secara online pada platform cloud Vercel (https://absensi-karyawan-three.vercel.app) dan terhubung langsung ke basis data cloud PostgreSQL Supabase. Antarmuka terbagi menjadi halaman otentikasi umum, antarmuka karyawan berbasis tampilan seluler (mobile view), dan antarmuka administrator berbasis layar lebar (desktop view):"
    ));

    let imgIdx = 1;

    // 1. Halaman Login
    bab4.push(...createPageScreenshotSection(
        "halaman-login-admin&karyawan.png",
        "Masuk Sistem (Log In)",
        "Halaman masuk sistem (log in) merupakan gerbang utama otentikasi universal bagi karyawan maupun administrator. Realisasi antarmuka ini mengadopsi kartu terpusat di tengah layar dengan form isian alamat email dan kata sandi. Validasi sisi klien diterapkan menggunakan skema Zod untuk memeriksa format penulisan email sebelum dikirimkan. Di sisi server, Better Auth memverifikasi kecocokan kata sandi dengan hash Bcrypt pada tabel account. Setelah otentikasi berhasil, sistem memeriksa peran (role) pengguna dan mengarahkan admin ke rute /admin serta karyawan ke rute /dashboard secara otomatis.",
        imgIdx++,
        false
    ));

    // 2. Beranda Karyawan (Mobile)
    bab4.push(...createPageScreenshotSection(
        "Beranda(karyawan).png",
        "Beranda Karyawan (Tampilan Mobile)",
        "Halaman beranda karyawan merupakan perwujudan prototype mobile-first untuk memudahkan pencatatan presensi di smartphone. Halaman ini memuat kartu status kehadiran harian yang menampilkan jam masuk (Clock-In) dan jam keluar (Clock-Out). Tombol aksi utama bersifat dinamis: tombol hijau 'Clock In' muncul saat karyawan belum presensi, dan berubah menjadi tombol merah 'Clock Out' setelah presensi masuk tercatat. Tombol ini mengintegrasikan Geolocation API browser untuk mengambil koordinat GPS dan memanggil Server Action untuk menghitung validasi geofencing kantor secara real-time.",
        imgIdx++,
        true
    ));

    // 3. Riwayat Karyawan (Mobile)
    bab4.push(...createPageScreenshotSection(
        "Riwayat(karyawan).png",
        "Riwayat Presensi Karyawan (Tampilan Mobile)",
        "Halaman riwayat presensi menyajikan daftar kehadiran historis karyawan yang bersangkutan dalam format daftar kartu seluler yang bersih. Informasi yang disajikan meliputi tanggal kehadiran, jam presensi masuk, jam presensi pulang, serta badge status kehadiran (Hadir Tepat Waktu atau Terlambat). Data ditarik secara real-time dari tabel attendance berdasarkan ID sesi pengguna aktif.",
        imgIdx++,
        true
    ));

    // 4. Pengajuan Cuti Karyawan (Mobile)
    bab4.push(...createPageScreenshotSection(
        "Pengajuan-cuti(karyawan).png",
        "Pengajuan Cuti Karyawan (Tampilan Mobile)",
        "Halaman formulir permohonan izin atau cuti mandiri bagi karyawan yang dapat diakses langsung dari ponsel pintar. Karyawan dapat memilih jenis cuti (Sakit, Liburan, atau Keperluan Lainnya), menentukan tanggal mulai dan selesai pada kalender terintegrasi, serta menuliskan alasan pengajuan secara jelas. Data kemudian disimpan ke tabel leaves dengan status awal 'pending' untuk diverifikasi oleh administrator.",
        imgIdx++,
        true
    ));

    // 5. Profil Karyawan (Mobile)
    bab4.push(...createPageScreenshotSection(
        "Profil(karyawan).png",
        "Profil Karyawan (Tampilan Mobile)",
        "Halaman profil menyajikan rincian informasi identitas karyawan yang sedang aktif login, meliputi foto profil, nama lengkap, alamat surel, departemen tempat bertugas, dan peran akun. Pada bagian bawah halaman, disediakan tombol 'Log Out' yang terintegrasi dengan Better Auth untuk menghancurkan token sesi aktif pada cookies browser dan menghapus sesi di database untuk mencegah penyalahgunaan akun.",
        imgIdx++,
        true
    ));

    // 6. Dashboard Admin (Desktop)
    bab4.push(...createPageScreenshotSection(
        "dashhboard(admin).png",
        "Dashboard Statistik Admin (Tampilan Desktop)",
        "Dashboard administrator dirancang untuk perangkat desktop dengan tata letak sidebar navigasi di sebelah kiri. Dasbor ini memuat 3 buah kartu indikator metrik utama (KPI) di bagian atas, yaitu Total Karyawan Aktif, Jumlah Karyawan Hadir Hari Ini, dan Jumlah Pengajuan Cuti Pending. Di bawah kartu statistik, disajikan tabel ringkasan aktivitas kehadiran harian seluruh staf beserta status presensinya secara terperinci.",
        imgIdx++,
        false
    ));

    // 7. Manajemen Karyawan Admin (Desktop)
    bab4.push(...createPageScreenshotSection(
        "Manajemen-karyawan(admin).png",
        "Manajemen Data Karyawan (Tampilan Desktop)",
        "Halaman manajemen karyawan menyediakan fasilitas bagi administrator untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada akun karyawan. Admin dapat melihat daftar seluruh staf dalam tabel interaktif yang dilengkapi kolom pencarian dan tombol edit/hapus. Tombol 'Tambah Karyawan' akan membuka modal dialog pop-up berisi formulir pembuatan akun baru dengan input nama, email, kata sandi, departemen, dan peran hak akses.",
        imgIdx++,
        false
    ));

    // 8. Laporan Kehadiran Admin (Desktop)
    bab4.push(...createPageScreenshotSection(
        "Lapran-kehadiran(admin).png",
        "Laporan Rekapitulasi Kehadiran (Tampilan Desktop)",
        "Halaman rekapitulasi laporan presensi memudahkan staf HRD dalam memantau, menganalisis, dan mencetak riwayat kehadiran seluruh divisi staf. Halaman ini dilengkapi dengan fitur filter interaktif berdasarkan rentang tanggal mulai/akhir dan kategori departemen. Server Action memproses kueri gabungan secara efisien antara tabel attendance dan user untuk menghasilkan data rekapitulasi kehadiran yang akurat.",
        imgIdx++,
        false
    ));

    // 9. Persetujuan Cuti Admin (Desktop)
    bab4.push(...createPageScreenshotSection(
        "Pengajuan-cuti(admin).png",
        "Persetujuan Cuti Karyawan (Tampilan Desktop)",
        "Antarmuka khusus administrator untuk memproses eskalasi izin atau cuti karyawan. Halaman ini memuat daftar tabel permohonan cuti berstatus 'pending'. Admin dapat menelaah alasan, kategori cuti, dan durasi tanggal izin. Disediakan tombol aksi instan 'Setujui' (untuk mengubah status menjadi approved) atau 'Tolak' (untuk mengubah status menjadi rejected) secara real-time.",
        imgIdx++,
        false
    ));

    // 10. Pengaturan Kantor Admin (Desktop)
    bab4.push(...createPageScreenshotSection(
        "Pengaturan-kantor(admin).png",
        "Pengaturan Lokasi Kantor & Geofencing (Tampilan Desktop)",
        "Halaman konfigurasi geofencing merupakan modul vital sistem absensi berbasis lokasi ini. Antarmuka mengintegrasikan Leaflet Map secara visual, memungkinkan admin untuk menggeser penanda (pin) lokasi kantor secara langsung di peta interaktif untuk memperbarui koordinat latitude dan longitude kantor pusat. Admin juga dapat menentukan radius toleransi absensi dalam satuan meter serta mengaktifkan/menonaktifkan fitur validasi lokasi. Data konfigurasi disimpan secara dinamis dalam format JSON pada tabel settings.",
        imgIdx++,
        false
    ));

    // --- 4.5 PENGUJIAN SISTEM (SYSTEM TESTING) ---
    bab4.push(createHeading("4.5 Pengujian Sistem (System Testing)", 2));
    bab4.push(createParagraph(
        "Pengujian sistem bertujuan untuk menguji fungsionalitas seluruh modul perangkat lunak dan memastikan bahwa setiap fitur bekerja secara tepat sesuai dengan spesifikasi kebutuhan fungsional yang telah dirancang pada Bab III tanpa menimbulkan galat (error)."
    ));

    // 4.5.1 Metode Pengujian
    bab4.push(createHeading("4.5.1 Metode Pengujian (Black-box Testing)", 3));
    bab4.push(createParagraph(
        "Metode pengujian yang diterapkan dalam penelitian skripsi ini adalah metode Black-box Testing. Metode ini berfokus pada pengujian masukan (input) dan keluaran (output) fungsionalitas aplikasi tanpa perlu menguji struktur kode internal perangkat lunak. Pengujian dilakukan dengan mengeksekusi berbagai skenario pengujian kasus positif (valid input) dan kasus negatif (invalid input) pada form antarmuka, lalu mengamati respon antarmuka dan konsistensi perubahan data pada basis data PostgreSQL."
    ));

    // 4.5.2 Hasil Pengujian Fungsional
    bab4.push(createHeading("4.5.2 Rencana dan Hasil Pengujian Fungsionalitas", 3));
    bab4.push(createParagraph(
        "Berdasarkan kasus uji yang telah disusun, berikut disajikan matriks lengkap hasil pengujian fungsionalitas sistem Absensi Pegawai yang telah dilaksanakan:"
    ));

    // Tabel 4.2 Matriks Pengujian
    bab4.push(createTableCaption("Tabel 4.2", "Matriks Kasus Uji dan Hasil Pengujian Fungsionalitas Black-Box Testing"));
    bab4.push(createStyledTable(
        ["No", "Fungsionalitas yang Diuji", "Skenario Kasus Uji", "Hasil yang Diharapkan", "Hasil Aktual", "Status"],
        [
            ["1", "Otentikasi Pengguna (Login Valid)", "Memasukkan email dan kata sandi karyawan yang terdaftar secara benar.", "Sistem memverifikasi kredensial dan mengarahkan ke dashboard karyawan (/dashboard).", "Berhasil login dan dialihkan ke /dashboard.", "Valid / Berhasil"],
            ["2", "Otentikasi Pengguna (Login Salah)", "Memasukkan kata sandi yang salah atau email yang tidak terdaftar.", "Sistem menolak otentikasi dan memunculkan notifikasi error kredensial tidak valid.", "Muncul pesan kesalahan login, akses ditolak.", "Valid / Berhasil"],
            ["3", "Pencegahan Akses Ilegal (Route Guard)", "Mencoba mengakses rute URL /admin secara langsung tanpa akun role admin.", "Sistem mencegat request via middleware dan me-redirect paksa kembali ke /dashboard.", "Diarahkan kembali ke /dashboard, halaman admin terproteksi.", "Valid / Berhasil"],
            ["4", "Presensi Masuk (Di Dalam Radius Kantor)", "Karyawan menekan Clock-In di area kantor (jarak terhitung d <= 100 meter).", "Sistem menerima presensi, menyimpan checkInTime dan status 'Hadir' ke tabel attendance.", "Presensi tersimpan, tombol berubah menjadi Clock Out.", "Valid / Berhasil"],
            ["5", "Presensi Masuk (Di Luar Radius Kantor)", "Karyawan menekan Clock-In di luar kantor (jarak terhitung d > 100 meter).", "Sistem menolak presensi dan menampilkan pesan peringatan 'Di luar jangkauan kantor'.", "Presensi ditolak, data kehadiran tidak tersimpan di database.", "Valid / Berhasil"],
            ["6", "Pencegahan Presensi Masuk Ganda", "Karyawan yang sudah clock-in mencoba menekan clock-in kembali pada hari yang sama.", "Sistem menolak request dan memunculkan pesan 'Anda sudah absen masuk hari ini'.", "Tombol dinonaktifkan dan request kedua ditolak sistem.", "Valid / Berhasil"],
            ["7", "Presensi Pulang (Clock-Out Valid)", "Karyawan menekan tombol Clock-Out pada akhir jam kerja di area kantor.", "Sistem memvalidasi lokasi dan memperbarui kolom checkOutTime pada record hari ini.", "Kolom checkOutTime terisi, status selesai presensi harian.", "Valid / Berhasil"],
            ["8", "Pengajuan Permohonan Cuti Valid", "Karyawan mengisi form cuti dengan alasan lengkap dan tanggal mulai < tanggal akhir.", "Sistem menyimpan data ke tabel leaves dengan status awal bernilai 'pending'.", "Permohonan tersimpan di database dengan status pending.", "Valid / Berhasil"],
            ["9", "Validasi Tanggal Pengajuan Cuti", "Karyawan memilih tanggal mulai yang lebih besar dari tanggal akhir cuti.", "Sistem menolak pengiriman form dan memunculkan pesan 'Tanggal mulai harus sebelum tanggal akhir'.", "Form ditolak, muncul notifikasi validasi tanggal.", "Valid / Berhasil"],
            ["10", "Persetujuan Cuti oleh Admin", "Admin meninjau cuti pending lalu menekan tombol 'Setujui' (Approve).", "Status permohonan pada tabel leaves berubah dari 'pending' menjadi 'approved'.", "Status ter-update menjadi approved secara real-time.", "Valid / Berhasil"],
            ["11", "Penolakan Cuti oleh Admin", "Admin meninjau cuti pending lalu menekan tombol 'Tolak' (Reject).", "Status permohonan pada tabel leaves berubah dari 'pending' menjadi 'rejected'.", "Status ter-update menjadi rejected secara real-time.", "Valid / Berhasil"],
            ["12", "Manajemen Akun Karyawan (CRUD)", "Admin menambahkan akun staf baru melalui modal dialog di menu karyawan.", "Akun staf baru tersimpan di tabel user dan kredensial terdaftar di Better Auth.", "Akun berhasil dibuat dan staf dapat langsung login.", "Valid / Berhasil"],
            ["13", "Pembaruan Lokasi Geofencing Peta", "Admin menggeser pin lokasi kantor di peta Leaflet dan mengubah radius menjadi 150m.", "Koordinat dan radius baru tersimpan pada tabel settings dan diterapkan saat absensi berikutnya.", "Konfigurasi kantor ter-update secara instan.", "Valid / Berhasil"],
            ["14", "Filter Laporan Kehadiran", "Admin memfilter rekapitulasi kehadiran berdasarkan divisi kerja dan rentang tanggal.", "Tabel menyajikan daftar kehadiran staf yang sesuai dengan kriteria filter yang dipilih.", "Data tabel tersaring sesuai parameter tanggal & divisi.", "Valid / Berhasil"]
        ]
    ));
    bab4.push(createParagraph("", { after: 120 }));

    bab4.push(createParagraph(
        "Berdasarkan 14 (empat belas) skenario pengujian Black-box yang dilaksanakan, seluruh butir pengujian memperoleh hasil aktual yang 100% selaras dengan hasil yang diharapkan. Hal ini membuktikan bahwa seluruh modul fungsional sistem Absensi Pegawai berjalan secara andal, bebas dari galat fatal, dan siap untuk dioperasikan."
    ));

    // --- 4.6 PEMBAHASAN HASIL PENELITIAN (DISCUSSION) ---
    bab4.push(createHeading("4.6 Pembahasan Hasil Penelitian (Discussion)", 2));
    bab4.push(createParagraph(
        "Pada bagian ini disajikan analisis mendalam dan pembahasan akademis mengenai temuan-temuan penting dari hasil implementasi dan pengujian sistem Absensi Pegawai:"
    ));

    // 4.6.1 Efektivitas Geofencing Haversine
    bab4.push(createHeading("4.6.1 Efektivitas Penerapan Geofencing Berbasis Rumus Haversine", 3));
    bab4.push(createParagraph(
        "Penerapan geofencing menggunakan rumus Haversine terbukti sangat efektif dalam menjamin validitas lokasi presensi karyawan. Berbeda dengan sistem absensi konvensional yang rentan terhadap manipulasi absensi titip absen atau pemalsuan waktu kerja, integrasi rumus Haversine di sisi server (Server Actions) memberikan kepastian matematis bahwa karyawan benar-benar berada di lingkungan fisik kantor saat menekan tombol presensi. Nilai koordinat GPS yang dikirimkan langsung dari perangkat peramban diverifikasi secara instan dengan radius toleransi kantor. Pemrosesan di sisi server ini juga mencegah manipulasi kode JavaScript di sisi peramban klien (Client-side tampering)."
    ));

    // 4.6.2 Evaluasi Penerapan Metode Prototyping
    bab4.push(createHeading("4.6.2 Evaluasi Keberhasilan Penerapan Metode Prototyping", 3));
    bab4.push(createParagraph(
        "Penggunaan metode Prototyping memberikan kontribusi signifikan terhadap keberhasilan pembangunan aplikasi. Melalui pembuatan prototipe antarmuka interaktif pada fase awal, kesenjangan pemahaman antara pengembang dan pengguna dapat dijembatani secara cepat. Masukan pengguna pada fase evaluasi prototype—seperti penambahan pemetaan visual lingkaran radius pada Leaflet Map dan perubahan warna tombol presensi dari hijau (Clock-In) menjadi merah (Clock-Out)—dapat diakomodasi sebelum sistem masuk ke fase pengodean akhir. Pendekatan ini terbukti memangkas waktu revisi pasca-implementasi dan menghasilkan aplikasi yang sangat ramah pengguna (User-Friendly)."
    ));

    // 4.6.3 Keunggulan Arsitektur Full-Stack Next.js Server Actions
    bab4.push(createHeading("4.6.3 Keunggulan Arsitektur Full-Stack Next.js Server Actions dan Keamanan Data", 3));
    bab4.push(createParagraph(
        "Pemanfaatan arsitektur full-stack Next.js App Router dengan Server Actions memberikan keunggulan teknis yang nyata dibandingkan arsitektur terpisah (Decoupled Frontend-Backend REST API). Komunikasi antar-komponen berjalan dalam satu basis kode terpadu dengan jaminan Type Safety penuh dari Drizzle ORM hingga antarmuka pengguna React. Tidak adanya endpoint REST API publik yang terbuka secara bebas meminimalisir celah serangan sniffing atau automated bot request, karena setiap Server Action dilindungi oleh validasi sesi internal Better Auth dan cookie Http-Only secara ketat."
    ));

    // --- 4.7 KESIMPULAN BAB IV ---
    bab4.push(createHeading("4.7 Kesimpulan Bab IV", 2));
    bab4.push(createParagraph(
        "Berdasarkan keseluruhan tahapan implementasi, pengujian sistem, dan pembahasan yang telah dipaparkan pada Bab IV ini, dapat disimpulkan bahwa:"
    ));
    bab4.push(createBulletItem("1. Aplikasi Absensi Pegawai berbasis web telah berhasil dibangun dan diimplementasikan secara utuh sesuai rancangan desain sistem pada Bab III menggunakan stack teknologi Next.js 15, TypeScript, Drizzle ORM, Better Auth, dan PostgreSQL Supabase."));
    bab4.push(createBulletItem("2. Algoritma geofencing berbasis rumus Haversine berhasil diintegrasikan pada Server Actions dan terbukti presisi dalam memvalidasi batas radius kehadiran karyawan secara real-time."));
    bab4.push(createBulletItem("3. Seluruh 10 rancangan antarmuka prototype telah berhasil direalisasikan ke dalam sistem online yang responsif, mencakup modul mobile karyawan dan modul desktop administrator."));
    bab4.push(createBulletItem("4. Pengujian fungsionalitas sistem menggunakan metode Black-box testing pada 14 skenario kasus uji memperoleh tingkat keberhasilan 100% valid, membuktikan bahwa aplikasi Absensi Pegawai siap untuk dioperasikan secara penuh dan layak dipertahankan dalam sidang skripsi."));

    return bab4;
}

// ==========================================
// FUNGSI UTAMA UNTUK GENERATE FILE DOCX
// ==========================================
function buildDocument() {
    const docChildren = [];

    // 1. Bangun Konten BAB III: DESAIN SISTEM (lengkap dengan Diagram & Prototype)
    console.log("Menyusun konten BAB III: DESAIN SISTEM beserta diagram & prototype...");
    const bab3Elements = buildBab3();
    docChildren.push(...bab3Elements);

    // 2. Bangun Konten BAB IV: HASIL DAN PEMBAHASAN (dimulai dengan Page Break)
    console.log("Menyusun konten BAB IV: HASIL DAN PEMBAHASAN...");
    const bab4Elements = buildBab4();
    docChildren.push(...bab4Elements);

    return docChildren;
}

async function generateDocx() {
    try {
        console.log("Memulai proses kompilasi dokumen Skripsi (BAB III & BAB IV)...");
        const docChildren = buildDocument();

        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: MARGIN_TOP,
                                bottom: MARGIN_BOTTOM,
                                left: MARGIN_LEFT,
                                right: MARGIN_RIGHT
                            }
                        }
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            children: [PageNumber.CURRENT],
                                            font: "Times New Roman",
                                            size: 20 // 10pt
                                        })
                                    ]
                                })
                            ]
                        })
                    },
                    children: docChildren
                }
            ]
        });

        const buffer = await Packer.toBuffer(doc);
        
        // Simpan ke Bab_III_dan_IV_Skripsi.docx
        const outputPath1 = path.join(__dirname, "Bab_III_dan_IV_Skripsi.docx");
        fs.writeFileSync(outputPath1, buffer);
        console.log(`Dokumen berhasil dibuat dan disimpan di: ${outputPath1}`);

        // Simpan juga ke Bab_IV_Skripsi.docx untuk kompatibilitas
        const outputPath2 = path.join(__dirname, "Bab_IV_Skripsi.docx");
        fs.writeFileSync(outputPath2, buffer);
        console.log(`Dokumen cadangan berhasil diperbarui di: ${outputPath2}`);

    } catch (error) {
        console.error("Terjadi kesalahan fatal saat membuat dokumen Word:", error);
    }
}

generateDocx();
