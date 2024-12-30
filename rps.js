import 'dotenv/config';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";
import fs from 'fs';

// Mengambil API Key dari variabel lingkungan
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    'API Key tidak ditemukan. Pastikan variabel lingkungan OPENAI_API_KEY sudah diatur.',
  );
}

// Inisialisasi OpenAI API
const openai = new OpenAI({
  apiKey: apiKey,
});

// Prompt untuk model
const systemPrompt = `
Anda adalah seorang perencana pendidikan yang berspesialisasi dalam desain kurikulum.
Anda akan diberikan rincian tentang sebuah mata kuliah, dan tugas Anda adalah membuat Rencana Pembelajaran Semester (RPS) terstruktur dalam format JSON.
RPS harus mencakup bagian-bagian berikut:
- Detail mata kuliah (nama, kode, rumpun, sks, semester, tanggal dibuat)
- Detail instruktur (pengembang, koordinator, ketua program)
- Deskripsi mata kuliah
- Capaian pembelajaran (umum dan khusus)
- Topik-topik mingguan dengan topik, subtopik dan kegiatan
- UTS pada pertemuan ke 8
- UAS pada pertemuan ke 16
- Komponen penilaian dengan bobot
Pastikan bahwa setiap topik mingguan memiliki subtopik dan kegiatan dalam bentuk array.
`;

const userPrompt = `
Nama Matakuliah: Dasar Algoritma dan Pemrograman
Kode Matakuliah: CW6552023109
Rumpun MK: Pemrograman dan Algoritma
SKS : 3
SKS Teori: 2
SKS Praktikum: 1
Pertemuan: 16
Semester: 1
Dosen Pengampuh: Fahrim
Koordinator Matakuliah : Elon Musk
Ketua Program Studi: Muhyiddin
Topik: Computational Thinking, Pseudocode, Flowchart, Percabangan, Perulangan, Visual Programming with Alice.
`;

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
const CourseDetailsSchema = z.object({
  nama_matakuliah: z.string(),
  kode_matakuliah: z.string(),
  rumpun_mk: z.string(),
  sks: z.number(),
  semester: z.number(),
  tanggal_dibuat: z.string(),
});

// Submodel untuk "instructor_details"
const InstructorDetailsSchema = z.object({
  dosen_pengampuh: z.array(z.string()),
  koordinator_matakuliah: z.string(),
  ketua_program_studi: z.string(),
});

// Submodel untuk "capaian_pembelajaran"
const CapaianPembelajaranSchema = z.object({
  umum: z.string(),
  khusus: z.array(z.string()),
});

// Submodel untuk item "topik_mingguan"
const TopikMingguanItemSchema = z.object({
  pekan: z.number(),
  topik: z.string(),
  subtopik: z.array(z.string()),
  kegiatan: z.array(z.string()),
});

// Submodel untuk "komponen_penilaian"
const KomponenPenilaianSchema = z.object({
  kehadiran: z.number(),
  tugas: z.number(),
  praktikum: z.number(),
  UTS: z.number(),
  UAS: z.number(),
});

// Model utama
const RpsModelSchema = z.object({
  course_details: CourseDetailsSchema,
  instructor_details: InstructorDetailsSchema,
  deskripsi_matakuliah: z.string(),
  capaian_pembelajaran: CapaianPembelajaranSchema,
  topik_mingguan: z.array(TopikMingguanItemSchema),
  komponen_penilaian: KomponenPenilaianSchema,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  response_format: zodResponseFormat(RpsModelSchema, "rps"),

});

const rawContent = completion.choices[0].message
const rpsResponse = JSON.parse(rawContent.content);

console.log(rpsResponse);
// console.log(JSON.stringify(rps.content, null, 4));

// // If the model refuses to respond, you will get a refusal message
// if (rps.refusal) {
// console.log(rps.refusal);
// } else {
// console.log(rps.parsed);
// }

// Fungsi untuk memanggil OpenAI API
// const generateRps = async () => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: userPrompt },
//       ],
//     });

//     // Log the raw response content
//     let rawContent = completion.choices[0].message.content;

//     // Remove backticks and json code block markers
//     rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '');

//     const rpsResponse = JSON.parse(rawContent);
//     console.log('Parsed response:', rpsResponse);

//     fs.writeFileSync('rpsResponse.json', JSON.stringify(rpsResponse, null, 4));

//     // Validasi response dengan zod
//     const validatedRps = RpsSchema.parse(rpsResponse);
//     fs.writeFileSync('validatedRps.txt', validatedRps);

//     console.log(JSON.stringify(validatedRps, null, 4));
//   } catch (error) {
//     console.error('Error generating RPS:', error.message);
//     if (error.errors) {
//       console.error(
//         'Validation errors:',
//         JSON.stringify(error.errors, null, 4),
//       );
//     }
//   }
// };

// // Memanggil fungsi
// generateRps();
