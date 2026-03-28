import { Column, Entity, OneToMany } from "typeorm";
import { BaseTable } from "./BaseTable";
import { UserOrganization } from "./UserOrganization";

@Entity()
export class User extends BaseTable {

	@Column({ type: "varchar", length: 255, nullable: true })
	public first_name: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	public last_name: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	public mobile: string;

	@OneToMany(() => UserOrganization, (uo) => uo.user)
	public organizations: UserOrganization[];

	build({ first_name, last_name, mobile, is_active }: { first_name: string, last_name: string, mobile: string, is_active?: boolean }) {
		super.build({ is_active });
		this.first_name = first_name;
		this.last_name = last_name;
		this.mobile = mobile;
		return this;
		
	}
}
