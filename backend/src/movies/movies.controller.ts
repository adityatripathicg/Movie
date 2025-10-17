import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('api/movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async findAll(@Request() req, @Query('page') page = 1, @Query('limit') limit = 8) {
    return this.moviesService.findAll(req.user.userId, +page, +limit);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.moviesService.findOne(id, req.user.userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  async create(
    @Request() req,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createMovieDto: CreateMovieDto = {
      title: body.title,
      publishing_year: parseInt(body.publishing_year),
    };
    return this.moviesService.create(createMovieDto, req.user.userId, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('poster'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateMovieDto: UpdateMovieDto = {
      title: body.title,
      publishing_year: body.publishing_year ? parseInt(body.publishing_year) : undefined,
      poster: body.poster,
    };
    return this.moviesService.update(id, updateMovieDto, req.user.userId, file);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.moviesService.remove(id, req.user.userId);
  }
}

