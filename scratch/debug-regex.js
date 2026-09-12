const ENGLISH_WORDS = [
    "geofencing", "black-box testing", "blueprint", "database", "real-time",
    "browser", "clock in", "clock-in", "clock out", "clock-out", "dashboard",
    "administrator", "crud", "role-based access control", "backend", "frontend",
    "server actions", "server action", "client components", "server components",
    "browser geolocation api", "middleware", "type safety", "authentication engine",
    "cookie", "cookies", "token", "password hash", "login", "log in", "log-in",
    "logout", "log out", "log-out", "latitude", "longitude", "radius", "error",
    "record", "lat", "lng", "db", "refresh", "checkintime", "checkouttime",
    "leave", "form", "pending", "approved", "rejected", "mobile view", "desktop view",
    "mobile-first", "smartphone", "check-in", "check-out", "list", "vacation",
    "sidebar", "card", "ter-update", "modal", "pop-up", "filter", "input",
    "hardware", "software", "runtime environment", "framework", "database server",
    "hosted", "client", "client-side", "server-side", "hash", "role", "mobile",
    "desktop", "monitoring", "create, read, update, delete", "query", "pin",
    "full-stack", "app router", "codebase", "user interface", "layout", "gps",
    "email", "account", "user", "admin", "employee", "attendance", "id",
    "session", "leaves", "string", "json", "settings", "leaflet map", "map",
    "validation", "uuid", "auth", "api", "black-box", "testing", "typescript",
    "javascript", "postgresql", "drizzle kit", "zod", "leaflet", "bcryptjs",
    "bcrypt", "node.js", "next.js", "drizzle orm", "better auth", "microsoft windows",
    "supabase", "ide", "visual studio code", "url"
];

const sortedWords = [...ENGLISH_WORDS].sort((a, b) => b.length - a.length);
const escWords = sortedWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
const englishRegex = new RegExp(`\\b(${escWords.join('|')})\\b`, 'gi');

const text = "Pada bab ini dibahas mengenai tahap perancangan sistem, implementasi sistem (pembangunan), serta pengujian fungsionalitas aplikasi E-Absensi Pegawai. Tahap perancangan menjelaskan pemodelan sistem, arsitektur teknologi, serta rancangan basis data. Tahap implementasi mendeskripsikan lingkungan pengembangan, implementasi basis data menggunakan Drizzle ORM, serta implementasi logika bisnis utama seperti validasi geofencing dengan rumus Haversine. Tahap pengujian menyajikan evaluasi fungsional aplikasi menggunakan metode Black-box testing untuk memastikan seluruh modul berjalan sesuai dengan kebutuhan.";

console.log("Regex:", englishRegex);
const parts = text.split(englishRegex);
console.log("Parts length:", parts.length);
parts.forEach((part, index) => {
    if (index % 2 === 1) {
        console.log(`[Italic Match] at ${index}: "${part}"`);
    } else {
        console.log(`[Normal Text] at ${index}: "${part.substring(0, 20)}..."`);
    }
});
