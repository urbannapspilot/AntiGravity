import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Booking } from "./Booking";

@Entity()
@Unique("idx_feedback_booking_id", ["booking_id"])
export class Feedback extends BaseTable {
  @Column({ type: 'uuid', length: 36, nullable: true })
  public booking_id: string;

  @Column({ type: 'int', nullable: true })
  public product_feedback_rating: number;

  @Column({ type: 'json', nullable: true })
  public product_feedback_tags: Array<String>;

  @Column({ type: 'int', nullable: true })
  public service_feedback_rating: number;

  @Column({ type: 'json', nullable: true })
  public service_feedback_tags: Array<String>;

  @Column({ type: 'text', nullable: true })
  public feedback_text: String;

  @Column({ type: 'json', nullable: true })
  public images: Array<String>;

  @OneToOne(() => Booking, (booking) => booking.feedback)
  @JoinColumn({ name: "booking_id", foreignKeyConstraintName: 'fk_feedback_booking_id' })
  public booking: Booking;

  build(
    { booking_id
      , product_feedback_rating
      , product_feedback_tags
      , service_feedback_rating
      , service_feedback_tags
      , feedback_text
      , images
      , is_active
    }:
      Partial<Feedback>
  ): Feedback {
    super.build({ is_active });
    this.booking_id = booking_id;
    this.product_feedback_rating = product_feedback_rating;
    this.product_feedback_tags = product_feedback_tags;
    this.service_feedback_rating = service_feedback_rating;
    this.service_feedback_tags = service_feedback_tags;
    this.feedback_text = feedback_text;
    this.images = images;

    return this;
  }

}