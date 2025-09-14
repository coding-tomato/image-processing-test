import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * MongoDB schema for storing image data.
 * This is part of the infrastructure layer and implements 
 * the persistence mechanism for Image entities.
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ImageDocument extends Document {
  @Prop({ required: true, default: () => String(new Date().getTime()) })
  id: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  resolution: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  md5: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(ImageDocument);
