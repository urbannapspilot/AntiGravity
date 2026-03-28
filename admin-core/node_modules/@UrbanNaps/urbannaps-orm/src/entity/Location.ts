import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Organization } from "./Organization";

@Entity()
export class Location extends BaseTable {
  @Column({ type: "varchar", length: 255 })
  public name: string;

  @Column({ type: "uuid", length: 36 })
  public organization_id: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: "fk_location_organization_id" })
  public organization: Organization;

  build({
    name,
    organization_id,
    is_active,
  }: {
    name: string;
    organization_id: string;
    is_active?: boolean;
  }): Location {
    super.build({ is_active });
    this.name = name;
    this.organization_id = organization_id;
    return this;
  }
}
