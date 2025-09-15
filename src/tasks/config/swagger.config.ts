import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Task } from '../domain/tasks/task.entity';

/**
 * Sets up Swagger documentation for the application
 * @param app - The Nest application instance
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Image Processing API')
    .setDescription('API for image processing tasks')
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [Task],
  });

  SwaggerModule.setup('api-docs', app, document);
}
