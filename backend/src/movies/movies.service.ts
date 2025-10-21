import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findAll(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const totalMovies = await this.movieModel.countDocuments({ user_id: userId });
    const movies = await this.movieModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedMovies = movies.map(movie => ({
      ...movie,
      id: movie._id.toString(),
    }));

    return {
      movies: transformedMovies,
      pagination: {
        page,
        limit,
        totalMovies,
        totalPages: Math.ceil(totalMovies / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const movie = await this.movieModel.findOne({ _id: id, user_id: userId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto, userId: string, file: Express.Multer.File) {
    const poster = file ? file.path : null;

    const movie = await this.movieModel.create({
      ...createMovieDto,
      poster,
      user_id: userId,
    });

    return {
      message: 'Movie created successfully',
      movie,
    };
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    // Only update poster if a new file was uploaded
    const updateData: any = {
      title: updateMovieDto.title,
      publishing_year: updateMovieDto.publishing_year,
    };

    if (file) {
      updateData.poster = file.path;
    }

    const movie = await this.movieModel.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateData,
      { new: true },
    );

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return {
      message: 'Movie updated successfully',
      movie,
    };
  }

  async remove(id: string, userId: string) {
    const movie = await this.movieModel.findOneAndDelete({ _id: id, user_id: userId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return { message: 'Movie deleted successfully' };
  }
}

