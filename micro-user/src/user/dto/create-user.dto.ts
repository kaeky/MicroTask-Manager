import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser un texto válido.' })
  firstName: string;

  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  @IsString({ message: 'El apellido debe ser un texto válido.' })
  lastName: string;

  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío.' })
  @IsNumber(
    {},
    { message: 'El número de teléfono debe contener solo números.' },
  )
  phone: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.',
  })
  password: string;
}
