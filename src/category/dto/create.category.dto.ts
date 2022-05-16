import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
export class CategoryCreateDto {
    @ApiProperty({
        type: String,
        description: 'Category name',
        required: true,
        minLength: 2,
        maxLength: 25,
        example: 'Travel',
    })
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty({ message: 'Post Title is required' })
    @MinLength(2)
    @MaxLength(25)
    readonly title: string;

    @ApiProperty({
        type: String,
        description: 'Category Description',
        required: true,
        minLength: 10,
        maxLength: 150,
        example: 'Category Description test',
    })
    @IsString()
    @IsNotEmpty({ message: 'Category description is required' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MinLength(10, {
        message:
            '$property is too short. Minimal length is $constraint1 characters',
    })
    @MaxLength(150)
    readonly description: string;


}
