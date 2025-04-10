import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class MatakuliahInfoBase {
  @Field() kode: string;
  @Field() nama: string;
  @Field() rumpun_mk: string;
  @Field(() => Int) sks: number;
  @Field(() => Int) semester: number;
}

@ObjectType()
class CapaianPembelajaranBase {
  @Field(() => [String]) capaian_pembelajaran_lulusan: string[];
  @Field(() => [String]) capaian_pembelajaran_matakuliah: string[];
  @Field(() => [String]) sub_cpmk: string[];
}

@ObjectType()
export class BahanAjarBaseModel {
  @Field()
  id: string;
  @Field(() => MatakuliahInfoBase)
  matakuliah_info: MatakuliahInfoBase;
  @Field(() => String) kata_pengantar: string;
  @Field(() => String) pengantar_matakuliah: string;
  @Field(() => [String]) topik_materi_ajar: string[];
  @Field(() => CapaianPembelajaranBase)
  capaian_pembelajaran: CapaianPembelajaranBase;
}
