"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var openai_1 = require("openai");
var zod_1 = require("zod");
var zod_2 = require("openai/helpers/zod");
// Mengambil API Key dari variabel lingkungan
var apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan variabel lingkungan OPENAI_API_KEY sudah diatur.");
}
// Inisialisasi OpenAI API
var openai = new openai_1.OpenAI({
    apiKey: apiKey,
});
// Prompt untuk model
var systemPrompt = "\nAnda adalah seorang perencana pendidikan yang berspesialisasi dalam desain kurikulum.\nAnda akan diberikan rincian tentang sebuah mata kuliah, dan tugas Anda adalah membuat Rencana Pembelajaran Semester (RPS) terstruktur dalam format JSON.\nRPS harus mencakup bagian-bagian berikut:\n- Detail mata kuliah (nama, kode, rumpun, sks, semester, tanggal dibuat)\n- Detail instruktur (pengembang, koordinator, ketua program)\n- Deskripsi mata kuliah\n- Capaian pembelajaran (umum dan khusus)\n- Topik-topik mingguan dengan topik, subtopik dan kegiatan\n- UTS pada pertemuan ke 8\n- UAS pada pertemuan ke 16\n- Komponen penilaian dengan bobot\nPastikan bahwa setiap topik mingguan memiliki subtopik dan kegiatan dalam bentuk array.\n";
var userPrompt = "\nNama Matakuliah: Dasar Algoritma dan Pemrograman\nKode Matakuliah: CW6552023109\nRumpun MK: Pemrograman dan Algoritma\nSKS : 3\nSKS Teori: 2\nSKS Praktikum: 1\nPertemuan: 16\nSemester: 1\nDosen Pengampuh: Fahrim\nKoordinator Matakuliah : Elon Musk\nKetua Program Studi: Muhyiddin\nTopik: Computational Thinking, Pseudocode, Flowchart, Percabangan, Perulangan, Visual Programming with Alice.\n";
// Submodel untuk "course_details"
var CourseDetailsSchema = zod_1.z.object({
    nama_matakuliah: zod_1.z.string(),
    kode_matakuliah: zod_1.z.string(),
    rumpun_mk: zod_1.z.string(),
    sks: zod_1.z.number(),
    semester: zod_1.z.number(),
    tanggal_dibuat: zod_1.z.string(),
});
// Submodel untuk "instructor_details"
var InstructorDetailsSchema = zod_1.z.object({
    dosen_pengampuh: zod_1.z.array(zod_1.z.string()),
    koordinator_matakuliah: zod_1.z.string(),
    ketua_program_studi: zod_1.z.string(),
});
// Submodel untuk "capaian_pembelajaran"
var CapaianPembelajaranSchema = zod_1.z.object({
    umum: zod_1.z.string(),
    khusus: zod_1.z.array(zod_1.z.string()),
});
// Submodel untuk item "topik_mingguan"
var TopikMingguanItemSchema = zod_1.z.object({
    pekan: zod_1.z.number(),
    topik: zod_1.z.string(),
    subtopik: zod_1.z.array(zod_1.z.string()),
    kegiatan: zod_1.z.array(zod_1.z.string()),
});
// Submodel untuk "komponen_penilaian"
var KomponenPenilaianSchema = zod_1.z.object({
    kehadiran: zod_1.z.number(),
    tugas: zod_1.z.number(),
    praktikum: zod_1.z.number(),
    UTS: zod_1.z.number(),
    UAS: zod_1.z.number(),
});
// Model utama
var RpsModelSchema = zod_1.z.object({
    course_details: CourseDetailsSchema,
    instructor_details: InstructorDetailsSchema,
    deskripsi_matakuliah: zod_1.z.string(),
    capaian_pembelajaran: CapaianPembelajaranSchema,
    topik_mingguan: zod_1.z.array(TopikMingguanItemSchema),
    komponen_penilaian: KomponenPenilaianSchema,
});
// Fungsi untuk mendapatkan respons dari OpenAI
var generateRPS = function () { return __awaiter(void 0, void 0, void 0, function () {
    var completion, rawContent, rpsResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt },
                        ],
                        response_format: (0, zod_2.zodResponseFormat)(RpsModelSchema, "rps"),
                    })];
            case 1:
                completion = _a.sent();
                rawContent = completion.choices[0].message;
                if (!(rawContent === null || rawContent === void 0 ? void 0 : rawContent.content)) {
                    throw new Error("Konten kosong diterima dari OpenAI.");
                }
                rpsResponse = JSON.parse(rawContent.content);
                console.log(rpsResponse);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Terjadi kesalahan saat menghasilkan RPS:", error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Memanggil fungsi
generateRPS();
