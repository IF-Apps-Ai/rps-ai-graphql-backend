import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class Matakuliah {
  @Field() kode: string;
  @Field() nama: string;
  @Field() rumpun_mk: string;
  @Field(() => Int) sks: number;
  @Field(() => Int) semester: number;
}

@ObjectType()
class DosenPengembang {
  @Field(() => [String]) dosen_pengampuh: string[];
  @Field() koordinator_matakuliah: string;
  @Field() ketua_program_studi: string;
}

@ObjectType()
class CapaianPembelajaranLulusan {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class CapaianPembelajaranMataKuliah {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class SubCapaianPembelajaranMataKuliah {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class TopikPerpekanItem {
  @Field(() => Int) pekan: number;
  @Field(() => [String]) sub_cpmk: string[];
  @Field(() => [String]) indikator: string[];
  @Field(() => [String]) bahan_kajian: string[];
}

@ObjectType()
class KomponenPenilaian {
  @Field(() => Int) kehadiran: number;
  @Field(() => Int) tugas: number;
  @Field(() => Int) praktikum: number;
  @Field(() => Int) UTS: number;
  @Field(() => Int) UAS: number;
}

@ObjectType()
export class RpsModel {
  @Field(() => Matakuliah) matakuliah: Matakuliah;
  @Field(() => [String]) bahan_kajian: string[];
  @Field(() => DosenPengembang) dosen_pengembang: DosenPengembang;
  @Field() deskripsi_matakuliah: string;
  @Field(() => CapaianPembelajaranLulusan)
  capaian_pembelajaran_lulusan: CapaianPembelajaranLulusan;
  @Field(() => CapaianPembelajaranMataKuliah)
  capaian_pembelajaran_matakuliah: CapaianPembelajaranMataKuliah;
  @Field(() => SubCapaianPembelajaranMataKuliah)
  sub_cpmk: SubCapaianPembelajaranMataKuliah;
  @Field(() => [TopikPerpekanItem]) topik_perpekan_item: TopikPerpekanItem[];
  @Field(() => KomponenPenilaian) komponen_penilaian: KomponenPenilaian;
}
