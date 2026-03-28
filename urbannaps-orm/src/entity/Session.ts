import { Column, Entity, OneToMany } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Booking } from "./Booking";

@Entity()
export class Session extends BaseTable {

  @Column({ type: 'varchar', length: 255, nullable: true })
  public email?: string;

  @Column({ type: 'json' })
  public metadata: object;

  @OneToMany(() => Booking, (booking) => booking.session)
  public bookings: Array<Booking>;

}

