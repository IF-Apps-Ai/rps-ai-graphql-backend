import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GenerateRpsInput {
  @Field()
  namaMataKuliah: string;
  @Field()
  kodeMataKuliah: string;
  @Field()
  rumpunMataKuliah: string;
  @Field()
  sks: number;
  @Field()
  sksTeori: number;
  @Field()
  sksPraktikum: number;
  @Field()
  jumlahPertemuan: number;
  @Field()
  semester: number;
  @Field()
  dosenPengampu: string;
  @Field()
  dosenKoordinator: string;
  @Field()
  ketuaProgram: string;
  @Field()
  bahanKajian: string;
  @Field()
  cpl: string;
}
