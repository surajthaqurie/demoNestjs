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

export class UpdateUserPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    example: '123@pass#123',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'current password is required' })
  readonly currentPassword: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    minLength: 8,
    example: '123@pass#123',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'new password is required' })
  @MinLength(8, {
    message: '$property is too short, must be at least 8 characters long',
  })
  readonly newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    minLength: 8,
    example: '123@pass#123',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'confirm password is required' })
    readonly confirmPassword: string;
}
