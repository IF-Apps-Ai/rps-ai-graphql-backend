import { Inject, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { BahanAjarModelSchema } from './bahan-ajar.schema';
import { zodResponseFormat } from 'openai/helpers/zod';
import { GenerateBahanAjarInput } from './dto/generate-bahan-ajar.input';
import { BahanAjarModel } from './models/bahan-ajar.model';
import { SettingsService } from 'src/settings/settings.service';
import { DataSource, Repository } from 'typeorm';
import { BahanAjarLog } from './entities/bahan-ajar-log.entity';

@Injectable()
export class BahanAjarService {
  private openai: OpenAI;
  private readonly bahanAjarLogRepository: Repository<BahanAjarLog>;

  constructor(
    private readonly settingsService: SettingsService,
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {
    this.bahanAjarLogRepository = this.dataSource.getRepository(BahanAjarLog);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'API Key tidak ditemukan. Pastikan variabel lingkungan OPENAI_API_KEY sudah diatur.',
      );
    }
    this.openai = new OpenAI({ apiKey });
  }

  async GenerateBahanAjar(
    input: GenerateBahanAjarInput,
  ): Promise<BahanAjarModel> {
    const systemPromptSetting = await this.settingsService.findOne(
      'bahan_ajar_prompt_system',
    );
    if (!systemPromptSetting) {
      throw new Error('System prompt not found in settings.');
    }
    const systemPrompt = systemPromptSetting.values;

    let userPrompt = `Saya ingin membuat modul bahan ajar digital untuk mata kuliah saya. Berikut adalah informasi yang diperlukan:
      Nama Matakuliah: ${input.namaMataKuliah}
  `;
    if (input.kodeMataKuliah) {
      userPrompt += `Kode Matakuliah: ${input.kodeMataKuliah}\n`;
    }

    if (input.rumpunMataKuliah) {
      userPrompt += `Rumpun MK: ${input.rumpunMataKuliah}\n`;
    }

    if (input.sks) {
      userPrompt += `SKS : ${input.sks}\n`;
    }

    if (input.sksTeori) {
      userPrompt += `SKS Teori: ${input.sksTeori}\n`;
    }
    if (input.sksPraktikum) {
      userPrompt += `SKS Praktikum: ${input.sksPraktikum}\n`;
    }
    if (input.jumlahPertemuan) {
      userPrompt += `Pertemuan: ${input.jumlahPertemuan}\n`;
    }
    if (input.semester) {
      userPrompt += `Semester: ${input.semester}\n`;
    }
    if (input.dosenPengampu) {
      userPrompt += `Dosen Pengampuh: ${input.dosenPengampu}\n`;
    }
    if (input.dosenKoordinator) {
      userPrompt += `Koordinator Matakuliah : ${input.dosenKoordinator}\n`;
    }
    if (input.ketuaProgram) {
      userPrompt += `Ketua Program Studi: ${input.ketuaProgram}\n`;
    }
    if (input.bahanKajian) {
      userPrompt += `Bahan Kajian: ${input.bahanKajian}\n`;
    }
    if (input.cpl) {
      userPrompt += `CPL: ${input.cpl}\n`;
    }
    if (input.instruksiKhusus) {
      userPrompt += `Instruksi Khusus: ${input.instruksiKhusus}\n`;
    }

    const openAiModelSetting = await this.settingsService.findOne(
      'bahan_ajar_ai_model',
    );
    if (!openAiModelSetting) {
      throw new Error('System prompt not found in settings.');
    }
    const openAiModel = openAiModelSetting.values;

    //  const openAiModel = process.env.OPENAI_MODEL;
    const completion = await this.openai.chat.completions.create({
      model: openAiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(BahanAjarModelSchema, 'bahan-ajar'),
      temperature: 0.7,
      max_tokens: 16383,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const rawContent = completion.choices[0].message;
    const bahanAjarResponse = JSON.parse(rawContent.content);

    // Check for token usage information
    const promptTokens = completion.usage?.prompt_tokens || 0;
    const completionTokens = completion.usage?.completion_tokens || 0;
    const totalTokens = completion.usage?.total_tokens || 0;

    // Log the request and response
    const log = new BahanAjarLog();
    log.user_id = '1b7b5c0e-868e-4824-b3b4-52581d5a9964'; // Assuming userId is part of GenerateBahanAjarInput
    log.prompt_system = systemPrompt;
    log.prompt_user = userPrompt;
    log.completions = completion;
    log.json_response = rawContent.content;
    log.prompt_tokens = promptTokens;
    log.completion_tokens = completionTokens;
    log.model = openAiModel;
    await this.bahanAjarLogRepository.save(log);

    // Log token usage information
    if (completion.usage) {
      console.log('Token usage information:');
      console.log(`AI Model: ${openAiModel}`);
      console.log(`Prompt tokens: ${promptTokens}`);
      console.log(`Completion tokens: ${completionTokens}`);
      console.log(`Total tokens: ${totalTokens}`);
    } else {
      console.log('Token usage information is not available in the response.');
    }

    return bahanAjarResponse;
  }
}
