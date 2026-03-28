import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Organization } from "./Organization";
import { PodPlan } from "./PodPlan";
import { Booking } from "./Booking";

@Entity()
export class Plan extends BaseTable {
  @Column({ type: "varchar", length: 255 })
  public plan_name: string;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public description: string;

  @Column({ type: "bigint" })
  public original_amount: number;

  @Column({ type: "bigint" })
  public discounted_amount: number;

  @Column({ type: "bigint" })
  public duration: number;

  @Column({ type: 'uuid', length: 36 })
  public organization_id: string;

  @ManyToOne(() => Organization, (organization) => organization.plans)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: "fk_plan_organization_id" })
  public organization;

  @OneToMany(() => PodPlan, (pod) => pod.plan)
  public pods: PodPlan[];

  @OneToMany(() => Booking, (booking) => booking.pod)
  public bookings: Booking[];

  build({
    plan_name,
    description,
    original_amount,
    discounted_amount,
    duration,
    organization_id,
    is_active,
  }: {
    plan_name: string;
    description?: string;
    original_amount: number;
    discounted_amount: number;
    duration: number;
    organization_id: string;
    is_active: boolean;
  }): Plan {
    super.build({ is_active });
    this.plan_name = plan_name;
    this.description = description;
    this.original_amount = original_amount;
    this.discounted_amount = discounted_amount;
    this.duration = duration;
    this.organization_id = organization_id;
    return this;
  }
}
