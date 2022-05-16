import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'First name',
    required: true,
    minLength: 5,
    maxLength: 25,
    example: 'Test firstName',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'First name is not empty' })
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
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name is not empty' })
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
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'email is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(7, { message: 'Enter Proper email' })
  readonly email: string;
  /* 
  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    minLength: 8,
    example: '123@pass#123',
  })
@IsOptional()  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(8, {
    message: '$property is too short, must be at least 8 characters long',
  })
  readonly password: string; */

  @ApiProperty({
    type: String,
    description: 'Contact Number',
    required: true,
    minLength: 10,
    maxLength: 10,
    uniqueItems: true,
    example: '1234567890',
  })
  @IsOptional()
  @IsString() // @IsInt()
  @IsNotEmpty({ message: 'Csontact number is not empty' })
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
  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter full address' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Address is not empty' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly address: string;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter street' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'City is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly street: string;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter city' })
  @MaxLength(50)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Postal code is not empty' })
  @MinLength(2, { message: 'Enter Proper postal Code' })
  readonly zipCode: string;

  @IsOptional()
  @MinLength(5, { message: '$value is too short. Please enter country' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'Country is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly country: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly imageUrl?: string;
}
