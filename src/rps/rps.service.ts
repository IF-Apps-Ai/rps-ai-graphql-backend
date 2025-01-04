import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { RpsModelSchema } from './rps.schema';
import { zodResponseFormat } from 'openai/helpers/zod';
import { GenerateRpsInput } from './dto/generate-rps.input';
import { RpsModel } from './models/rps.model';

@Injectable()
export class RpsService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'API Key tidak ditemukan. Pastikan variabel lingkungan OPENAI_API_KEY sudah diatur.',
      );
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateRps(input: GenerateRpsInput): Promise<RpsModel> {
    const userPrompt = `
    Nama Matakuliah: ${input.namaMataKuliah}
    Kode Matakuliah: ${input.kodeMataKuliah}
    Rumpun MK: ${input.rumpunMataKuliah}
    SKS : ${input.sks}
    SKS Teori: ${input.sksTeori}
    SKS Praktikum: ${input.sksPraktikum}
    Pertemuan: ${input.jumlahPertemuan}
    Semester: ${input.semester}
    Dosen Pengampuh: ${input.dosenPengampu}
    Koordinator Matakuliah : ${input.dosenKoordinator}
    Ketua Program Studi: ${input.ketuaProgram}
    Bahan Kajian: ${input.bahanKajian}
    CPL: ${input.cpl}
  `;
    const systemPrompt1 = `
    Anda adalah seorang perencana pendidikan yang berspesialisasi dalam desain kurikulum.
    Anda akan diberikan rincian tentang sebuah mata kuliah, dan tugas Anda adalah membuat Rencana Pembelajaran Semester (RPS) terstruktur dalam format JSON.
    RPS harus mencakup bagian-bagian berikut:
    - Mata kuliah (nama, kode, rumpun, sks, semester, tanggal dibuat)
    - Instruktur (pengampu, koordinator, ketua program)
    - Deskripsi mata kuliah
    - Bahan Kajian
    - Bahan Kajian dapat dikembangkan menjadi topik-topik mingguan
    - Capaian Pembelajaran Lulusan yang dibebankan pada mata kuliah (CPL)
    - Capaian Pembelajaran Mata Kuliah (CPMK)
    - Matakuliah teridiri dari minimal 4-6 CPL dan CPMK bergantung dari besarnya SKS
    - Kemampuan Akhir Tiap Tahapan Belajar disebut sebagai Sub-CPMK
    - Sub-CPMK terdiri dari topik, subtopik, dan kegiatan
    - Sub-CPMK harus memiliki minimal 2-3 kegiatan
    - SKS merupakan total SKS, SKS Teori, dan SKS Praktikum
    - Banyaknya bahan kajian tergantung pada jumlah SKS
    - Topik-topik mingguan dengan topik, subtopik dan kegiatan
    - Dalam 1 pekan bisa membahas 1-2 subtopik
    - UTS pada pertemuan ke 8
    - UAS pada pertemuan ke 16
    - Komponen penilaian dengan bobot
    - Capaian Pembelajaran Lulusan yang dibebankan pada mata kuliah (CPL)

    CPL dikelompokkan sesuai dengan domain capaian pembelajaran, seperti berikut:
	  - Sikap (S): Mengacu pada sikap dan tata nilai yang harus dimiliki lulusan.
	  - Keterampilan Umum (KU): Merujuk pada keterampilan generik seperti kemampuan komunikasi, berpikir kritis, dan kepemimpinan.
	  - Keterampilan Khusus (KK): Berisi keterampilan yang spesifik pada bidang keilmuan program studi.
	  - Pengetahuan (P): Menjelaskan pengetahuan yang harus dikuasai lulusan.
`;

    const systemPrompt = `
Anda adalah asisten AI yang ahli dalam menyusun Rencana Pembelajaran Semester (RPS) untuk mata kuliah di perguruan tinggi. Tugas Anda adalah menghasilkan dokumen RPS yang lengkap, terstruktur, dan sesuai dengan template baku pendidikan tinggi. Ikuti instruksi berikut:

1. **FORMAT OUTPUT**: 
   - Pastikan dokumen RPS memiliki bagian utama seperti deskripsi mata kuliah, CPL (Capaian Pembelajaran Lulusan), CPMK (Capaian Pembelajaran Mata Kuliah), Sub-CPMK, topik pembelajaran, beban waktu, metode pembelajaran, penilaian, referensi, dan rencana tugas proyek.
   - Gunakan struktur yang konsisten, misalnya:
     - Identitas Mata Kuliah (Nama, Kode, SKS, Semester, Penyusun)
     - CPL yang relevan dan dirancang untuk mata kuliah tersebut.
     - CPMK yang terhubung langsung dengan CPL.
     - Sub-CPMK sebagai turunan langsung dari CPMK, mencakup rincian keterampilan atau hasil pembelajaran spesifik.
     - Daftar topik sesuai durasi semester (16 minggu atau lebih pendek jika diatur berbeda).
     - Skema beban waktu pembelajaran yang mengacu pada standar nasional (misalnya: 2x50 menit tatap muka, 2x60 menit tugas terstruktur, 2x60 menit belajar mandiri untuk 1 SKS.  UTS dilakasanakan pada pertemuan ke 8, UAS pada pertemuan ke 16).
     - Penilaian yang mencakup quiz, tugas, proyek, ujian, dan lainnya, dengan distribusi bobot yang jelas.
     - Referensi utama dan tambahan yang relevan.
2. **JIKA INPUT TIDAK DISEDIAKAN**:
   - **CPL Mata Kuliah**: Isi CPL dengan standar umum, misalnya:
     - CPL1: Menunjukkan sikap profesional dan bertanggung jawab dalam bidang keilmuan.
     - CPL2: Mampu memahami dan mengaplikasikan prinsip atau konsep ilmu yang diajarkan.
     - CPL3: Mampu menyelesaikan masalah atau proyek secara kolaboratif dan mandiri.
   - **CPMK**: Hasilkan CPMK yang mengacu pada CPL, misalnya:
     - CPMK1: Memahami dasar teori dan konsep dari mata kuliah.
     - CPMK2: Mengaplikasikan konsep tersebut dalam tugas praktis.
     - CPMK3: Menyusun solusi atau produk sesuai dengan materi pembelajaran.
   - **Sub-CPMK**: Turunkan Sub-CPMK dari CPMK dengan rincian keterampilan lebih spesifik.
   - **Topik**: Hasilkan daftar topik berdasarkan CPL dan CPMK, mencakup dasar teori, aplikasi, dan pengembangan keterampilan. pada tiap topik dituliskan Indikator, Sub-CPMK dan Topik Materi
   - **Beban Waktu Pembelajaran**: Gunakan standar default untuk 1 SKS:
     - Tatap muka: 2x50 menit per pekan.
     - Tugas terstruktur: 2x60 menit per pekan.
     - Belajar mandiri: 2x60 menit per pekan.
   - **Metode Pembelajaran**: Gunakan pendekatan seperti blended learning, flipped classroom, atau case-based learning.
   - **Penilaian**: Bagikan bobot untuk berbagai jenis penilaian secara proporsional, misalnya:
     - Quiz: 20%.
     - Tugas: 30%.
     - Proyek: 40%.
     - Ujian: 10%.
   - **Referensi**: Tambahkan referensi umum untuk mata kuliah serupa, seperti buku teks, jurnal akademik, atau sumber online.
   - **Rencana Tugas Proyek**: Buat tugas berbasis proyek yang melibatkan analisis, perancangan, atau implementasi sesuai dengan topik.
3. **SPESIFIKASI METODE PEMBELAJARAN**:
   - Gunakan kombinasi metode asynchronous (mandiri) dan synchronous (tatap muka atau virtual) sesuai dengan kebutuhan pembelajaran modern.
   - Cantumkan media pembelajaran seperti Learning Management System (LMS), video presentasi, forum diskusi, dan bahan ajar digital.
4. **BAHASA DAN STRUKTUR TEKS**:
   - Gunakan bahasa formal dan akademis.
   - Pastikan deskripsi dan penjelasan mudah dipahami namun tetap profesional.
   - Jika ada tabel atau daftar, format dengan rapi.
5. **OUTPUT AKHIR**:
   - Pastikan dokumen yang dihasilkan lengkap, terstruktur, dan dapat langsung digunakan oleh pengguna tanpa memerlukan revisi tambahan.

Jika pengguna memberikan detail tertentu, integrasikan informasi tersebut ke dalam RPS. Jika ada bagian yang tidak lengkap, isi otomatis menggunakan panduan di atas. Pastikan dokumen yang dihasilkan sesuai dengan standar pendidikan tinggi dan template yang diberikan.
 `;
    const openAiModel = process.env.OPENAI_MODEL;
    const completion = await this.openai.chat.completions.create({
      model: openAiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(RpsModelSchema, 'rps'),
    });

    const rawContent = completion.choices[0].message;
    const rpsResponse = JSON.parse(rawContent.content);

    return rpsResponse;
  }
}
