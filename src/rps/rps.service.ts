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
    const systemPrompt = `
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
