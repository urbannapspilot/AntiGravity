import { Column, Entity, Index, OneToMany, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { UserOrganization } from "./UserOrganization";
import { RfidCard } from "./RfidCard";
import { Pod } from "./Pod";
import { Plan } from "./Plan";

@Entity()
@Unique("org_unique_slug", ["slug"])
@Index("idx_org_login_enabled", ["login_enabled"])
export class Organization extends BaseTable {
  @Column({ type: "varchar", length: 255 })
  public slug: string;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public description: string;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public title: string;

  @Column({ type: "varchar", length: 255 })
  public type: string;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public website: string;

  @Column({ type: "varchar", length: 1023 })
  public address: string;

  @Column({ type: "json" })
  public allowed_domains: Array<string>;

  @Column("boolean")
  public is_payment_enabled: boolean;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public logo_url: string;

  @Column({ type: "boolean", nullable: false, default: false })
  public login_enabled: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  public payment_gateway: string;

  @Column({ type: "json", nullable: true })
  public metadata: object;

  @OneToMany(() => UserOrganization, (uo) => uo.organization)
  public users: UserOrganization[];

  @OneToMany(() => RfidCard, (card) => card.organization)
  public rfids: RfidCard[];

  @OneToMany(() => Pod, (pod) => pod.organization)
  public pods: Pod[];

  @OneToMany(() => Plan, (plan) => plan.organization)
  public plans: Plan[];

  build({
    slug,
    title,
    description,
    type,
    website,
    address,
    allowed_domains,
    is_payment_enabled,
    logo_url,
    is_active,
    login_enabled
  }: {
    slug: string;
    title: string;
    description?: string;
    type: string;
    website?: string;
    address: string;
    allowed_domains: Array<string>;
    is_payment_enabled: boolean;
    logo_url?: string;
    is_active?: boolean;
    login_enabled?: boolean;
  }): Organization {
    super.build({ is_active });
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.type = type;
    this.website = website;
    this.address = address;
    this.allowed_domains = allowed_domains;
    this.is_payment_enabled = is_payment_enabled;
    this.logo_url = logo_url;
    this.login_enabled = login_enabled;
    return this;
  }
}
