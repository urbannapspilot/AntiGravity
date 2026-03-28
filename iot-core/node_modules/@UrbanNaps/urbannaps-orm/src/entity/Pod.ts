import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { PodFeature } from "./PodFeature";
import { Organization } from "./Organization";
import { PodPlan } from "./PodPlan";
import { Booking } from "./Booking";

@Entity()
@Unique("pod_unique_slug", ["slug"])
@Unique("pod_unique_thing_name", ["thing_name"])
export class Pod extends BaseTable {
  @Column({ type: "varchar", length: 255 })
  public slug: string;

  @Column({ type: "varchar", length: 255 })
  public thing_name: string;

  @Column({ type: "varchar", length: 255 })
  public title: string;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public description: string;

  @Column({ type: "varchar", length: 255 })
  public type: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  public master_chip_id: string;

  @Column({ type: "uuid", length: 36 })
  public organization_id: string;

  @OneToMany(() => PodFeature, (feature) => feature.pod, { cascade: true })
  public features: PodFeature[];

  @ManyToOne(() => Organization, (org) => org.pods)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: "fk_pod_organization_id" })
  public organization: Organization;

  @OneToMany(() => PodPlan, (plan) => plan.pod, { cascade: true })
  public plans: PodPlan[];

  @OneToMany(() => Booking, (booking) => booking.pod)
  public bookings: Booking[];

  build({
    slug,
    thing_name,
    title,
    description,
    type,
    master_chip_id,
    organization_id,
    is_active,
  }: {
    slug: string;
    thing_name?: string;
    title: string;
    description?: string;
    type: string;
    master_chip_id: string;
    organization_id: string;
    is_active: boolean;
  }) {
    super.build({ is_active });
    this.slug = slug;
    this.thing_name = thing_name;
    this.title = title;
    this.description = description;
    this.type = type;
    this.master_chip_id = master_chip_id;
    this.organization_id = organization_id;
    return this;
  }
}
