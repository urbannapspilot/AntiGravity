import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Booking } from "./Booking";


@Entity()
@Unique("idx_payment_booking_id", ["booking_id"])
export class Payment extends BaseTable {

  @Column({ type: 'uuid', length: 36 })
  public booking_id: string;

  @Column({ type: "varchar", length: 255 })
  public payment_gateway: string;

  @Column({ type: "json", nullable: true })
  public payment_request: object;

  @Column({ type: "json", nullable: true })
  public payment_response: object;

  @Column({ type: "json", nullable: true })
  public metadata: object;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: "booking_id", foreignKeyConstraintName: 'fk_payment_booking_id' })
  public booking: Booking;

  build(
    {
      booking_id,
      payment_gateway,
      payment_request,
      payment_response,
      metadata,
      is_active
    }:
      Partial<Payment>
  ): Payment {
    super.build({ is_active });
    this.booking_id = booking_id;
    this.payment_gateway = payment_gateway;
    this.payment_request = payment_request;
    this.payment_response = payment_response;
    this.metadata = metadata;

    return this;
  }
}


