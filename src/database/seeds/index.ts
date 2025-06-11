import dataSource from '../typeorm.config';
import { seedPermissions } from './permission.seed';

dataSource.initialize().then(async () => {
  console.log('🔁 Running seeders...');
  await seedPermissions(dataSource);
  await dataSource.destroy();
  console.log('🌱 Done seeding');
}).catch((err) => {
  console.error('❌ Error running seeders', err);
});
