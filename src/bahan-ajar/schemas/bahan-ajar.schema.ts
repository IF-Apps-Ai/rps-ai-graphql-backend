import { z } from 'zod';

// Submodel untuk "Deskripsi Matakuliah"
const MatakuliahInfoSchema = z.object({
  kode: z.string(),
  nama: z.string(),
  rumpun_mk: z.string(),
  sks: z.number(),
  semester: z.number(),
});

// Submodel untuk "CapaianPembelajaran"
const CapaianPembelajaranSchema = z.object({
  capaian_pembelajaran_lulusan: z.array(z.string()),
  capaian_pembelajaran_matakuliah: z.array(z.string()),
  sub_cpmk: z.array(z.string()),
});

// Submodel untuk "PengantarMataKuliah"
const PengantarMataKuliahxSchema = z.object({
  deskripsi_maata_kuliah: z.string(),
  capaian_pembelajaran: CapaianPembelajaranSchema,
});

// Submodel untuk "PertemuanPerPekanItem"
const PertemuanPerPekanItemSchema = z.object({
  pekan: z.number(),
  deskripsi_topik: z.string(),
  cpmk: z.array(z.string()),
  sub_cpmk: z.array(z.string()),
  indikator: z.array(z.string()),
  bahan_kajian: z.array(z.string()),
  petunjuk_belajar_topik: z.string(),
  // uraian_materi_ajar_topik: z.array(z.string()),
});

// Submodel untuk "SoalEvaluasi"
const SoalEvaluasiSchema = z.object({
  soal: z.string(),
  jawaban: z.array(z.string()),
  kunci_jawaban: z.string(),
});

// Model Utama "BahanAjarModel"
export const BahanAjarModelSchema = z.object({
  matakuliah_info: MatakuliahInfoSchema,
  kata_pengantar: z.string(),
  pengantar_matakuliah: PengantarMataKuliahxSchema,
  topik_materi_ajar: z.array(z.string()),
  cara_penggunaan_module: z.string(),
  referensi: z.array(z.string()),
  pertemuan_per_pekan: z.array(PertemuanPerPekanItemSchema),
  soal_evaluasi: z.array(SoalEvaluasiSchema),
  glosarium: z.string(),
});
