import { Column, Entity, OneToMany, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { PodFeature } from "./PodFeature";

@Entity()
@Unique('feature_unique_slug', ['slug'])
export class Feature extends BaseTable {

  @Column({ type: 'varchar', length: 255 })
  public slug: string;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'varchar', length: 255 })
  public pod_type: string;

  @Column({ type: 'varchar', length: 1023 })
  public description: string;

  @OneToMany(() => PodFeature, (pod) => pod.feature, { cascade: true })
  public pods: PodFeature[];

  build({ slug, title, pod_type, description, is_active }: { slug: string, title: string, pod_type: string, description?: string; is_active?: boolean}) {
    super.build({ is_active });
    this.slug = slug;
    this.title = title;
    this.pod_type = pod_type;
    this.description = description;
    return this;
  }

}

