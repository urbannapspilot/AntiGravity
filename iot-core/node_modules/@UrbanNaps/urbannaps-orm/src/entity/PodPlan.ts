import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "./BaseTable";
import { Pod } from "./Pod";
import { Plan } from "./Plan";

@Entity()
export class PodPlan extends BaseTable {

  @Column({ type: 'uuid', length: 36 })
  public pod_id: string;

  @Column({ type: 'uuid', length: 36 })
  public plan_id: string;

  @ManyToOne(() => Pod, (pod) => pod.plans)
  @JoinColumn({ name: "pod_id", foreignKeyConstraintName: 'fk_podplan_pod_id' })
  public pod: Pod;

  @ManyToOne(() => Plan, (plan) => plan.pods)
  @JoinColumn({ name: "plan_id", foreignKeyConstraintName: 'fk_podplan_plan_id' })
  public plan: Plan;

  build({ pod_id, plan_id, is_active }: { pod_id: string, plan_id: string, is_active: boolean }): PodPlan {
    super.build({ is_active });
    this.pod_id = pod_id;
    this.plan_id = plan_id;
    return this;
    
  }
}