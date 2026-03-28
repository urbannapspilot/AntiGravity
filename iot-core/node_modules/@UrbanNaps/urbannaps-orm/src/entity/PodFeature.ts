import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Pod } from "./Pod";
import { Feature } from "./Feature";

@Entity()
export class PodFeature extends BaseTable {
  @Column({ type: "uuid", length: 36 })
  public pod_id: string;

  @Column({ type: "uuid", length: 36 })
  public feature_id: string;

  @Column("boolean")
  public is_enabled: boolean;

  @ManyToOne(() => Pod, (pod) => pod.features)
  @JoinColumn({ name: "pod_id", foreignKeyConstraintName: "fk_podfeature_pod_id" })
  public pod: Pod;

  @ManyToOne(() => Feature, (feature) => feature.pods)
  @JoinColumn({ name: "feature_id", foreignKeyConstraintName: "fk_podfeature_feature_id" })
  public feature: Feature;

  build({
    pod_id,
    feature_id,
    is_enabled,
    is_active,
  }: {
    pod_id: string;
    feature_id: string;
    is_enabled: boolean;
    is_active: boolean;
  }): PodFeature {
    super.build({ is_active });
    this.pod_id = pod_id;
    this.feature_id = feature_id;
    this.is_enabled = is_enabled;
    return this;
  }
}
