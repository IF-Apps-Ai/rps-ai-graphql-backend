import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { RpsModelSchema } from './rps.schema';
import { zodResponseFormat } from 'openai/helpers/zod';

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

  async generateRps(userPrompt: string): Promise<any> {
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
    - Sub CPMK (Capaian Pembelajaran Umum dan Khusus)
    - Topik-topik mingguan dengan topik, subtopik dan kegiatan
    - UTS pada pertemuan ke 8
    - UAS pada pertemuan ke 16
    - Komponen penilaian dengan bobot

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
    console.log(rpsResponse);

    return rpsResponse;
  }
}
