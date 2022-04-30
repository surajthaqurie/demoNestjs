import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthSignupDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(5, {
    message:
      '$property is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(25, {
    message: '$property is too long. Maximal length is $constraint1 characters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(5, {
    message:
      '$property is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(25, {
    message: '$property is too long. Maximal length is $constraint1 characters',
  })
  lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(7, { message: ' Is this $value is an email ?' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(8, {
    message: '$property is too short, must be at least 8 characters long',
  })
  password: string;

  @IsNotEmpty({ message: 'Contact number is required' })
  @IsString() // @IsInt()
  @Length(10, 10, { message: 'Contact number contains 10' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  contactNo: string;

  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address: string;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  city: string;

  @IsOptional()
  @IsNumber()
  @MinLength(2)
  zipCode: number;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  country: string;
}
