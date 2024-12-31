import { z } from 'zod';

// Submodel untuk "matakuliah"
const MatakuliahSchema = z.object({
  kode: z.string(),
  nama: z.string(),
  rumpun_mk: z.string(),
  sks: z.number(),
  semester: z.number(),
});

// Submodel untuk "bahan_kajian"
const BahanKajianSchema = z.object({
  topik: z.string(),
});

// Submodel untuk "dosen"
const DosenPengembangSchema = z.object({
  dosen_pengampuh: z.array(z.string()),
  koordinator_matakuliah: z.string(),
  ketua_program_studi: z.string(),
});

// Submodel untuk "capaian_pembelajaran"
const CapaianPembelajaranSchema = z.object({
  kode: z.array(z.string()),
  nama: z.array(z.string()),
});

// Submodel untuk "kemampuan_akhir"
const KemampuanAkhirSchema = z.object({
  kode: z.array(z.string()),
  nama: z.array(z.string()),
});

// Submodel untuk item "topik_perpekan_item"
const TopikPerpekanItemSchema = z.object({
  pekan: z.number(),
  sub_cpmk: z.array(z.string()),
  indikator: z.array(z.string()),
  bahan_kajian: z.array(z.string()),
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
export const RpsModelSchema = z.object({
  matakuliah: MatakuliahSchema,
  bahan_kajian: z.array(z.string()),
  dosen_pengembang: DosenPengembangSchema,
  deskripsi_matakuliah: z.string(),
  capaian_pembelajaran_lulusan: CapaianPembelajaranSchema,
  capaian_pembelajaran_matakuliah: CapaianPembelajaranSchema,
  kemampuan_akhir: KemampuanAkhirSchema,
  topik_perpekan_item: z.array(TopikPerpekanItemSchema),
  komponen_penilaian: KomponenPenilaianSchema,
});
