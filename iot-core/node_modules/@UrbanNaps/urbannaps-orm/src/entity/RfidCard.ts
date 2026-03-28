import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Organization } from "./Organization";
import { Booking } from "./Booking";

@Entity()
@Unique('rfid_unique_card_number', ['card_number'])
export class RfidCard extends BaseTable {

  @Column({ type: 'varchar', length: 255 })
  public card_number: string;

  @Column({ type: 'varchar', length: 255 })
  public card_type: string;

  @Column({ type: 'bigint' })
  public usage_time: number;

  @Column({ type: 'uuid', length: 36 })
  public organization_id: string;

  @ManyToOne(() => Organization, (organization) => organization.rfids)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: 'fk_rfid_card_organization_id' })
  public organization: Organization;

  @OneToMany(() => Booking, (booking) => booking.rfid)
  public bookings: Booking[];

  build({
    card_number,
    card_type,
    usage_time,
    organization_id,
    is_active,
  }: {
    card_number: string;
    card_type: string;
    usage_time: number;
    organization_id: string;
    is_active: boolean;
  }): RfidCard {
    super.build({ is_active });
    this.card_number = card_number;
    this.card_type = card_type;
    this.usage_time = usage_time;
    this.organization_id = organization_id;
    return this;

  }

}