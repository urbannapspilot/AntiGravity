import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseTable {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { default: true })
  is_active?: boolean = true;

  @CreateDateColumn({ type: 'datetime' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;

  build({ is_active = true } : { is_active?: boolean }): BaseTable {
    this.is_active = is_active;
    return this;
  }
}