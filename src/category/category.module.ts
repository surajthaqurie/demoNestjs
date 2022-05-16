import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { categoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/category.schema';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ],
    controllers: [categoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }
