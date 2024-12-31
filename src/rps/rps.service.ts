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
    - Detail mata kuliah (nama, kode, rumpun, sks, semester, tanggal dibuat)
    - Detail instruktur (pengembang, koordinator, ketua program)
    - Deskripsi mata kuliah
    - Bahan Kajian
    - Capaian Pembelajaran Lulusan yang dibebankan pada mata kuliah (CPL)
    - Capaian Pembelajaran Mata Kuliah (CPMK)
    - Kemampuan Akhir Tiap Tahapan Belajar (Sub-CPMK)
    - Topik-topik mingguan dengan topik, subtopik dan kegiatan
    - UTS pada pertemuan ke 8
    - UAS pada pertemuan ke 16
    - Komponen penilaian dengan bobot
    - Capaian Pembelajaran Lulusan yang dibebankan pada mata kuliah (CPL)
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(RpsModelSchema, 'rps'),
    });

    const rawContent = completion.choices[0].message;
    const rpsResponse = JSON.parse(rawContent.content);
    // console.log(rpsResponse);

    return rpsResponse;
  }
}
