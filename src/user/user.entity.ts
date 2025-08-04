import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usuarios")
class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "nombre_completo" })
  nombre_completo!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "contrasena" })
  contrasena!: string;

  @Column()
  foto?: string;

  @Column()
  estado?: boolean;

  @Column({ name: "fecha_creacion" })
  fecha_creacion!: string;
}

export default User;
