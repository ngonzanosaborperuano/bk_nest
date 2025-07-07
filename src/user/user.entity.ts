import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usuarios")
class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "nombre_completo" })
  fullname!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "contrasena" })
  contrasena!: string;

  @Column()
  foto?: string;

  @Column()
  estado?: boolean;

  @Column({ name: "fecha_creacion" })
  fechaCreacion!: string;
}

export default User;
