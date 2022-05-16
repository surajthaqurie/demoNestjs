import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostCreateDto {
  @ApiProperty({
    type: String,
    description: 'Post name',
    required: true,
    minLength: 5,
    maxLength: 50,
    example: 'Post test',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Post Title is required' })
  @MinLength(5)
  @MaxLength(50)
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'Post Content',
    required: true,
    minLength: 10,
    // maxLength: 25,
    example: 'Post Content test',
  })
  @IsString()
  @IsNotEmpty({ message: 'Post content is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(10, {
    message:
      '$property is too short. Minimal length is $constraint1 characters',
  })
  // @MaxLength()
  readonly content: string;

  @ApiProperty({
    type: String, // object id mongoose
    description: 'Post category',
    required: true,
    example: 'Travel', // id of
  })
  @IsString()
  @IsNotEmpty({ message: 'category is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly category: string;
}
