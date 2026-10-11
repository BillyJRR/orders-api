import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    email!: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash!: string;

    @Column({ name: 'full_name', type: 'varchar', length: 150 })
    fullName!: string;

    @Column({ type: 'varchar', length: 20 })
    role!: string;

    @Column({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;
}