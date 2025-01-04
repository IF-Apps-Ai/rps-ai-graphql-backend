import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GenerateBahanAjarInput {
  @Field()
  namaMataKuliah: string;
  @Field({ nullable: true })
  kodeMataKuliah?: string;
  @Field({ nullable: true })
  rumpunMataKuliah?: string;
  @Field({ nullable: true })
  sks?: number;
  @Field({ nullable: true })
  sksTeori?: number;
  @Field({ nullable: true })
  sksPraktikum?: number;
  @Field({ nullable: true })
  jumlahPertemuan?: number;
  @Field({ nullable: true })
  semester?: number;
  @Field({ nullable: true })
  dosenPengampu?: string;
  @Field({ nullable: true })
  dosenKoordinator?: string;
  @Field({ nullable: true })
  ketuaProgram?: string;
  @Field({ nullable: true })
  bahanKajian?: string;
  @Field({ nullable: true })
  cpl?: string;
  @Field({ nullable: true })
  instruksiKhusus?: string;
}
