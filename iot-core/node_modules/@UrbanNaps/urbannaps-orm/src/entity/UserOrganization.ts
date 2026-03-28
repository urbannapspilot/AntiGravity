import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { Organization } from "./Organization";

@Entity()
@Unique('user_organization_unique_email', ['email'])
@Unique('user_organization_unique_user_id_organization_id', ['user_id', 'organization_id'])
export class UserOrganization extends BaseTable {

  @Column({ type: 'uuid', length: 36 })
  public user_id: string;

  @Column({ type: 'uuid', length: 36 })
  public organization_id: string;

  @Column({ type: 'varchar', length: 255 })
  public role: string;

  @Column({ type: 'varchar', length: 255 })
  public email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public password: string;

  @Column('boolean', { default: false })
  public is_default_organization: boolean = false;

  @Column('boolean', { default: false })
  public is_initial_password_changed: boolean = false;

  @ManyToOne(() => User, (user) => user.organizations)
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: 'fk_userorganization_user_id' })
  public user: User;

  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: "organization_id", foreignKeyConstraintName: 'fk_userorganization_organization_id' })
  public organization: Organization;

  build({
    user_id,
    organization_id,
    role,
    email,
    password,
    is_active,
  }: {
    user_id: string;
    organization_id: string;
    role: string;
    email: string;
    password: string;
    is_active: boolean;
  }): UserOrganization {
    super.build({ is_active });
    this.user_id = user_id;
    this.organization_id = organization_id;
    this.role = role;
    this.email = email;
    this.password = password;
    return this;
    
  }

}