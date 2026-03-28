import { Column, Entity } from "typeorm";
import { BaseTable } from "./BaseTable";

@Entity()
export class ResetPassword extends BaseTable {

  @Column({ type: 'varchar', length: 255 })
  public email: string;

  @Column({ type: 'varchar', length: 255 })
  public token: string;

  @Column({ type: 'datetime' })
  public expires_at: Date;

  @Column({ type: 'boolean', default: false })
  public is_attempted: boolean = false;

  build({ email, token, expires_at, is_active }: { email: string, token: string, expires_at: Date, is_active?: boolean }) {
    super.build({ is_active });
    this.email = email;
    this.token = token;
    this.expires_at = expires_at;
    return this;
    
  }
}