import dataSource from '../typeorm.config';
import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';

dataSource.initialize().then(async () => {
  console.log('🔁 Running seeders...');
  await seedPermissions(dataSource);
  await seedRoles(dataSource);
  await dataSource.destroy();
  console.log('🌱 Done seeding');
}).catch((err) => {
  console.error('❌ Error running seeders', err);
});
