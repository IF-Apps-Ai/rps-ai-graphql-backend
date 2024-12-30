'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
require('dotenv/config');
var openai_1 = require('openai');
var zod_1 = require('zod');
var zod_2 = require('openai/helpers/zod');
// Mengambil API Key dari variabel lingkungan
var apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    'API Key tidak ditemukan. Pastikan variabel lingkungan OPENAI_API_KEY sudah diatur.',
  );
}
// Inisialisasi OpenAI API
var openai = new openai_1.OpenAI({
  apiKey: apiKey,
});
// Prompt untuk model
var systemPrompt =
  '\nAnda adalah seorang perencana pendidikan yang berspesialisasi dalam desain kurikulum.\nAnda akan diberikan rincian tentang sebuah mata kuliah, dan tugas Anda adalah membuat Rencana Pembelajaran Semester (RPS) terstruktur dalam format JSON.\nRPS harus mencakup bagian-bagian berikut:\n- Detail mata kuliah (nama, kode, rumpun, sks, semester, tanggal dibuat)\n- Detail instruktur (pengembang, koordinator, ketua program)\n- Deskripsi mata kuliah\n- Capaian pembelajaran (umum dan khusus)\n- Topik-topik mingguan dengan topik, subtopik dan kegiatan\n- UTS pada pertemuan ke 8\n- UAS pada pertemuan ke 16\n- Komponen penilaian dengan bobot\nPastikan bahwa setiap topik mingguan memiliki subtopik dan kegiatan dalam bentuk array.\n';
var userPrompt =
  '\nNama Matakuliah: Dasar Algoritma dan Pemrograman\nKode Matakuliah: CW6552023109\nRumpun MK: Pemrograman dan Algoritma\nSKS : 3\nSKS Teori: 2\nSKS Praktikum: 1\nPertemuan: 16\nSemester: 1\nDosen Pengampuh: Fahrim\nKoordinator Matakuliah : Elon Musk\nKetua Program Studi: Muhyiddin\nTopik: Computational Thinking, Pseudocode, Flowchart, Percabangan, Perulangan, Visual Programming with Alice.\n';
// Skema validasi menggunakan zod
// const RpsSchema = z.object({
//   course_details: z.object({
//     nama_matakuliah: z.string(),
//     kode_matakuliah: z.string(),
//     rumpun_mk: z.string(),
//     sks: z.number(),
//     semester: z.number(),
//     tanggal_dibuat: z.string(),
//   }),
//   instructor_details: z.object({
//     dosen_pengampuh: z.array(z.string()),
//     koordinator_matakuliah: z.string(),
//     ketua_program_studi: z.string(),
//   }),
//   deskripsi_matakuliah: z.string(),
//   capaian_pembelajaran: z.object({
//     umum: z.string(),
//     khusus: z.array(z.string()),
//   }),
//   topik_mingguan: z.array(
//     z.object({
//       minggu: z.number(),
//       topik: z.string(),
//       subtopik: z.array(z.string()),
//       kegiatan: z.array(z.string()),
//     }),
//   ),
//   komponen_penilaian: z.object({
//     kehadiran: z.number(),
//     tugas: z.number(),
//     praktikum: z.number(),
//     UTS: z.number(),
//     UAS: z.number(),
//   }),
// });
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
var completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  response_format: (0, zod_2.zodResponseFormat)(RpsModelSchema, 'rps'),
});
var rawContent = completion.choices[0].message;
var rpsResponse = JSON.parse(rawContent.content);
console.log(rpsResponse);
