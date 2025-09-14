import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot(),
    
    // Setup MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/imagetasks'),
    
    // Feature modules
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
