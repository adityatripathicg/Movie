import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function seed() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get(getModelToken(User.name));

    console.log('Seeding database...');

    const existingUser = await userModel.findOne({ email: 'demo@example.com' });

    if (existingUser) {
      console.log('Demo user already exists');
    } else {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await userModel.create({
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo User',
      });
      console.log('Demo user created: demo@example.com / password123');
    }

    console.log('Done!');
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

