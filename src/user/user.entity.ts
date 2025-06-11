import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usuarios")
class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "nombre_completo" })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "contrasena" })
  password!: string;

  @Column()
  foto?: string;

  @Column()
  estado?: boolean;
}

export default User;
