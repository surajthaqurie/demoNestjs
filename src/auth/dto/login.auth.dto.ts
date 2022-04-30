import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'Email or Contact No is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly emailContact: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly password: string;
}
