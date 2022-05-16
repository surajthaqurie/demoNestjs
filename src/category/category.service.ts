import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryCreateDto } from './dto/create.category.dto';
import { ICategory } from './interface/category.interface';
import { Category } from './schemas/category.schema';

import * as mongoose from 'mongoose';
import { CategoryUpdateDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<ICategory>,
  ) {}

  async createCategory(
    categoryCreateDto: CategoryCreateDto,
    userId: string,
  ): Promise<ICategory> {
    try {
      let query: object = { title: categoryCreateDto.title };
      const categoryCheck = await this._categoryModel.findOne(query);
      if (categoryCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Conflict',
            msg: 'Sorry !!! this category is already registered',
          },
          HttpStatus.CONFLICT,
        );
      }
      const createCategory = new this._categoryModel(categoryCreateDto);
      createCategory.owner = userId;

      return createCategory.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllCategory(): Promise<ICategory[]> {
    try {
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address imageUrl' },
      ];
      const categories = await this._categoryModel
        .find()
        .populate('owner', 'fullName email contactNo address imageUrl');
      if (categories.length === 0) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! no categories available',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return categories;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ICategory> {
    try {
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address imageUrl' },
      ];
      let _id = new mongoose.Types.ObjectId(id);
      const category = await this._categoryModel
        .findById(_id)
        .populate(populateQuery);
      // .populate('owner', 'fullName email contactNo address imageUrl');

      if (!category) {
        throw new HttpException(
          {
            success: false,
            status: 'Bad Request',
            msg: 'Sorry !!! this is unknown category',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<ICategory> {
    try {
      let _id = new mongoose.Types.ObjectId(id);

      const category = await this._categoryModel.findByIdAndRemove(_id);
      if (!category) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    id: string,
    categoryUpdateDto: CategoryUpdateDto,
    userId: string,
  ): Promise<ICategory> {
    try {
      let _id = new mongoose.Types.ObjectId(id);

      const checkCategory = await this._categoryModel.findById(_id);
      if (!checkCategory) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'category record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (categoryUpdateDto.title) {
        let query: object = { title: categoryUpdateDto.title };
        const titleCheck = await this._categoryModel.findOne(query);
       
        if (titleCheck || checkCategory.title !== titleCheck.title) {
          throw new HttpException(
            {
              success: false,
              status: 'Conflict',
              msg: 'Sorry !!! this category is already registered',
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      const category = await this._categoryModel.findByIdAndUpdate(
        _id,
        categoryUpdateDto,
        {
          new: true,
        },
      );
      if (!category) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! category records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      category.updated_by = userId;
      category.updated_on = new Date();

      return await category.save();
    } catch (error) {
      throw error;
    }
  }
}
