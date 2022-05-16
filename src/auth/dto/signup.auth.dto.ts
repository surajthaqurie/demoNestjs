import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    description: 'First name',
    required: true,
    minLength: 5,
    maxLength: 25,
    example: 'Test firstName',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(5)
  @MaxLength(25)
  readonly firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name',
    required: true,
    minLength: 5,
    maxLength: 25,
    example: 'Test lastName',
  })
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
  readonly lastName: string;

  @ApiProperty({
    type: String,
    description: 'Email',
    required: true,
    uniqueItems: true,
    minLength: 7,
    example: 'demo@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(7, { message: ' Is this $value is an email ?' })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    minLength: 8,
    example: '123@pass#123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(8, {
    message: '$property is too short, must be at least 8 characters long',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: 'Contact Number',
    required: true,
    minLength: 10,
    maxLength: 10,
    uniqueItems: true,
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'Contact number is required' })
  @IsString() // @IsInt()
  @Length(10, 10, { message: 'Contact number contains 10' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly contactNo: string;

  @ApiProperty({
    type: String,
    description: 'Address',
    required: true,
    minLength: 5,
    maxLength: 50,
    example: 'Kathmandu',
  })
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly address: string;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'City is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly city: string;

  @IsOptional()
  @IsNumber()
  readonly zipCode: number;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly country: string;
}
