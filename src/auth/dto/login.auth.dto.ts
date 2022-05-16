import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    type: String,
    description: 'Email or contact number',
    required: true,
    example: 'demo@example.com',
  })
  @IsNotEmpty({ message: 'Email or Contact No is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly emailContact: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    example: '123@pass#123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly password: string;
}
