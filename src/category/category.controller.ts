import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { NEVER } from 'rxjs';
import { JwtGuard, RolesGuard } from 'src/guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';
import { CategoryService } from './category.service';
import { CategoryUpdateDto } from './dto';
import { CategoryCreateDto } from './dto/create.category.dto';

@Controller('category')
export class categoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createCategory(
    @Req() req: Request,
    @Body() categoryCreateDto: CategoryCreateDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];
      const createResponse = await this._categoryService.createCategory(
        categoryCreateDto,
        userId,
      );
      if (!createResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to create category',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'category created successfully',
        category: createResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get()
  async getAllCategory(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const getResponse = await this._categoryService.getAllCategory();

      if (getResponse.length < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get category',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting all category successfully',
        category: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const getResponse = await this._categoryService.getCategoryById(id);
      if (!getResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get category',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting category successfully',
        category: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() categoryUpdateDto: CategoryUpdateDto,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];
      const updateResponse = await this._categoryService.updateCategory(
        id,
        categoryUpdateDto,
        userId,
      );

      if (!updateResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to update category',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Category updated successfully',
        category: updateResponse,
      });
    } catch (error) {
      return next(error);
    }
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const deletedResponse = await this._categoryService.deleteCategory(id);
      if (!deletedResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to delete category',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Category deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
