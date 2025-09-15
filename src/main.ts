import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './shared/http/filters/http-exception.filter';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply global HTTP exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Setup Swagger documentation
  setupSwagger(app);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/api-docs`);
}
bootstrap();
