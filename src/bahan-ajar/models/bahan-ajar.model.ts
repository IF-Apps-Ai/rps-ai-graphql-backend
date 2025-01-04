import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class MatakuliahInfo {
  @Field() kode: string;
  @Field() nama: string;
  @Field() rumpun_mk: string;
  @Field(() => Int) sks: number;
  @Field(() => Int) semester: number;
}

@ObjectType()
class BaCapaianPembelajaranLulusan {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class BaCapaianPembelajaranMataKuliah {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class BaSubCapaianPembelajaranMataKuliah {
  @Field(() => [String]) kode: string[];
  @Field(() => [String]) nama: string[];
}

@ObjectType()
class CapaianPembelajaran {
  @Field(() => String) capaian_pembelajaran_lulusan: string[];
  @Field(() => String) capaian_pembelajaran_matakuliah: string[];
  @Field(() => String) sub_cpmk: string[];
}

@ObjectType()
class PengantarMataKuliah {
  @Field(() => String) deskripsi_maata_kuliah: string;
  @Field(() => CapaianPembelajaran) capaian_pembelajaran: CapaianPembelajaran;
}

@ObjectType()
class PertemuanPerPekanItem {
  @Field(() => Int) pekan: number;
  @Field(() => [String]) sub_cpmk: string[];
  @Field(() => [String]) indikator: string[];
  @Field(() => [String]) bahan_kajian: string[];
}

@ObjectType()
export class BahanAjarModel {
  @Field(() => MatakuliahInfo)
  matakuliah_info: MatakuliahInfo;
  @Field(() => String) kata_pengantar: string;
  @Field(() => PengantarMataKuliah) pengantar_matakuliah: PengantarMataKuliah;
  @Field(() => [String]) topik_materi_ajar: string[];
  @Field(() => String) cara_penggunaan_module: string;
  @Field(() => [String]) referensi: string[];
  @Field(() => [PertemuanPerPekanItem]) pertemuan_per_pekan: [
    PertemuanPerPekanItem,
  ];
}
