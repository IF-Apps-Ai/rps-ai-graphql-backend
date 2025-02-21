import { z } from 'zod';

// Submodel untuk "MatakuliahInfoBase"
const MatakuliahInfoBaseSchema = z.object({
  kode: z.string(),
  nama: z.string(),
  rumpun_mk: z.string(),
  sks: z.number(),
  semester: z.number(),
});

// Submodel untuk "CapaianPembelajaranBase"
const CapaianPembelajaranBaseSchema = z.object({
  capaian_pembelajaran_lulusan: z.array(z.string()),
  capaian_pembelajaran_matakuliah: z.array(z.string()),
  sub_cpmk: z.array(z.string()),
});

// Model Utama "BahanAjarModelBase"
export const BahanAjarModelBaseSchema = z.object({
  matakuliah_info: MatakuliahInfoBaseSchema,
  kata_pengantar: z.string(),
  pengantar_matakuliah: z.string(),
  topik_materi_ajar: z.array(z.string()),
  capaian_pembelajaran: CapaianPembelajaranBaseSchema,
});
