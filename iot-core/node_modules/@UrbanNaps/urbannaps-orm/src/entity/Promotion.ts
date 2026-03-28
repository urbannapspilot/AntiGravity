import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Organization } from "./Organization";

@Entity()
@Unique("promo_unique_code_org", ["code", "organization_id"])
export class Promotion extends BaseTable {
  @Column({ type: "varchar", length: 50 })
  public code: string;

  @Column({ type: "varchar", length: 50 })
  public discountType: string;

  @Column("decimal", { precision: 10, scale: 2 })
  public discountValue: number;

  @Column("boolean", { default: true })
  public active: boolean;

  @Column("int", { default: 100 })
  public maxUses: number;

  @Column("int", { default: 0 })
  public currentUses: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  public minimumSpend: number;

  @Column({ type: "datetime" })
  public startDate: Date;

  @Column({ type: "datetime" })
  public endDate: Date;

  @Column({ type: "varchar", length: 1023, nullable: true })
  public description: string;

  @Column({ type: "varchar", length: 100, default: "global" })
  public redemptionStrategy: string;

  @Column({ type: "json", nullable: true })
  public generatedCodes: any;

  @Column({ type: "uuid", length: 36 })
  public organization_id: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: "fk_promotion_organization_id" })
  public organization: Organization;

  build({
    code,
    discountType,
    discountValue,
    active,
    maxUses,
    currentUses,
    minimumSpend,
    startDate,
    endDate,
    description,
    redemptionStrategy,
    generatedCodes,
    organization_id,
    is_active,
  }: {
    code: string;
    discountType: string;
    discountValue: number;
    active?: boolean;
    maxUses?: number;
    currentUses?: number;
    minimumSpend?: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    redemptionStrategy?: string;
    generatedCodes?: any;
    organization_id: string;
    is_active?: boolean;
  }): Promotion {
    super.build({ is_active });
    this.code = code;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.active = active ?? true;
    this.maxUses = maxUses ?? 100;
    this.currentUses = currentUses ?? 0;
    this.minimumSpend = minimumSpend ?? 0;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.redemptionStrategy = redemptionStrategy || "global";
    this.generatedCodes = generatedCodes || [];
    this.organization_id = organization_id;
    return this;
  }
}
