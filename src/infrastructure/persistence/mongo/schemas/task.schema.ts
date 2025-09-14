import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Task Schema for MongoDB
 * 
 * This schema defines how Task entities are stored in MongoDB.
 * It maps the domain entity to a MongoDB document structure.
 */
@Schema({ timestamps: true })
export class TaskDocument extends Document {
  @Prop({ required: true, default: () => String(new Date().getTime()) })
  id: string;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  originalPath: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

/**
 * Generated Mongoose schema for Task
 */
export const TaskSchema = SchemaFactory.createForClass(TaskDocument);
