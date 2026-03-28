import { Column, Entity, Index } from "typeorm";
import { BaseTable } from "./BaseTable";

@Entity()
@Index("idx_opt_email", ["email"])
export class Otp extends BaseTable {
  @Column({ type: 'int' })
  public otp: number;

  @Column({ type: 'varchar', length: 255 })
  public email: string;

  @Column({ type: 'datetime' })
  public expires_at: Date;

  @Column({ type: 'int', nullable: true })
  public retry_counter?: number;

  @Column({ type: 'datetime', nullable: true })
  public cooldown_time?: Date;

  build({ otp, email, expires_at, is_active, cooldown_time, retry_counter }: Partial<Otp>): BaseTable {
    super.build({ is_active });
    this.otp = otp;
    this.email = email;
    this.expires_at = expires_at;
    this.cooldown_time = cooldown_time;
    this.retry_counter = retry_counter;
    return this;

  }
}