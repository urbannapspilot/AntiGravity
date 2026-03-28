import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Pod } from "./Pod";
import { Plan } from "./Plan";
import { Session } from "./Session";
import { RfidCard } from "./RfidCard";
import { Feedback } from "./Feedback";
import { Payment } from "./Payment";

@Entity()
@Check('ck_booking_session_id', `(booking_source <> 'online' OR session_id IS NOT NULL)`)
@Index("idx_booking_status", ["status"])
@Unique("idx_booking_order_id", ["order_id"])

export class Booking extends BaseTable {
  @Column({ type: 'uuid', length: 36 })
  public pod_id: string;

  @Column({ type: 'uuid', length: 36, nullable: true })
  public plan_id: string;

  @Column({ type: 'datetime' })
  public start_time: Date;

  @Column({ type: 'datetime' })
  public end_time: Date;

  @Column({ type: 'datetime', nullable: true })
  public effactive_end_time: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public booking_source: string;

  @Column({ type: 'uuid', length: 36, nullable: true })
  public session_id: string;

  @Column({ type: 'uuid', length: 36, nullable: true })
  public rfid_card_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public order_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'pending' })
  public status: string;

  @ManyToOne(() => Pod, (pod) => pod.bookings)
  @JoinColumn({ name: "pod_id", foreignKeyConstraintName: 'fk_booking_pod_id' })
  public pod: Pod;

  @ManyToOne(() => Plan, (plan) => plan.bookings, { nullable: true })
  @JoinColumn({ name: "plan_id", foreignKeyConstraintName: 'fk_booking_plan_id' })
  public plan: Plan;

  @ManyToOne(() => Session, (session) => session.bookings, { nullable: true })
  @JoinColumn({ name: "session_id", foreignKeyConstraintName: 'fk_booking_session_id' })
  public session: Session;

  @ManyToOne(() => RfidCard, (card) => card.bookings, { nullable: true })
  @JoinColumn({ name: "rfid_card_id", foreignKeyConstraintName: 'fk_booking_rfid_card_id' })
  public rfid: RfidCard;

  @OneToOne(() => Feedback, (feedback) => feedback.booking)
  public feedback: Feedback;

  @OneToOne(() => Payment, (payment) => payment.booking)
  public payment: Payment;

  build({ pod_id, plan_id, start_time, end_time, effactive_end_time, booking_source, session_id, is_active, order_id, status }: { pod_id: string, plan_id: string, start_time: Date, end_time: Date, effactive_end_time: Date, booking_source: string, is_active: boolean, session_id: string; order_id: string; status: string; }): Booking {
    super.build({ is_active });
    this.pod_id = pod_id;
    this.plan_id = plan_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.effactive_end_time = effactive_end_time;
    this.booking_source = booking_source;
    this.session_id = session_id;
    this.order_id = order_id;
    this.status = status;
    return this;

  }
}