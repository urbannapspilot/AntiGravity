import { Column, Entity } from "typeorm";
import { BaseTable } from "./BaseTable";

@Entity()
export class PodType extends BaseTable {
  @Column({ type: 'varchar', length: 255 })
  public type: string;

  build({ type, is_active }: { type: string, is_active?: boolean; }): PodType {
    super.build({ is_active });
    this.type = type;
    return this;
  }
}