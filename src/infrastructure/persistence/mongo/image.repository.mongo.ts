import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageRepository } from '../../../domain/images/image.repository.port';
import { Image } from '../../../domain/images/image.entity';
import { ImageDocument } from './schemas/image.schema';

/**
 * MongoDB implementation of the ImageRepository port.
 * This adapter connects the domain layer to MongoDB infrastructure.
 */
@Injectable()
export class ImageRepositoryMongo implements ImageRepository {
  constructor(
    @InjectModel(ImageDocument.name)
    private readonly imageModel: Model<ImageDocument>,
  ) {}

  /**
   * Saves an image entity to MongoDB
   * Creates a new document in the database.
   * @param image The domain Image entity to save
   * @returns A promise that resolves to the saved domain Image entity
   */
  async save(image: Image): Promise<Image> {
    const imageData = {
      id: image.id,
      taskId: image.taskId,
      resolution: image.resolution,
      path: image.path,
      md5: image.md5,
      ...(image.createdAt && { createdAt: image.createdAt }),
    };

    const createdImage = new this.imageModel(imageData);
    const savedImage = await createdImage.save();

    return this.mapToDomainEntity(savedImage);
  }

  /**
   * Finds all images associated with a specific task
   * @param taskId The ID of the task to find images for
   * @returns A promise that resolves to an array of domain Image entities
   */
  async findByTaskId(taskId: string): Promise<Image[]> {
    const images = await this.imageModel.find({ taskId }).exec();
    return images.map((image) => this.mapToDomainEntity(image));
  }

  /**
   * Maps a MongoDB document to a domain Image entity
   * @param imageDocument The MongoDB document
   * @returns A domain Image entity
   */
  private mapToDomainEntity(imageDocument: ImageDocument): Image {
    return new Image({
      id: imageDocument.id,
      taskId: imageDocument.taskId,
      resolution: imageDocument.resolution,
      path: imageDocument.path,
      md5: imageDocument.md5,
      createdAt: imageDocument.createdAt,
    });
  }
}
