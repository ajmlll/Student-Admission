import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { ExamSlotsModule } from './modules/exam-slots/exam-slots.module';
import { AdmissionModule } from './modules/admission/admission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb://localhost:27017/school-admission',
      }),
    }),
    UsersModule,
    AuthModule,
    StudentsModule,
    ExamSlotsModule,
    AdmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
