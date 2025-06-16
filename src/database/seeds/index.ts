import dataSource from '../typeorm.config';
import { seedRolesAndPermissions } from './role.seed';
import { seedUsers } from './user.seed';

dataSource.initialize().then(async () => {
  console.log('🔁 Running seeders...');
  await seedRolesAndPermissions(dataSource);
  await seedUsers(dataSource);
  await dataSource.destroy();
  console.log('🌱 Done seeding');
}).catch((err) => {
  console.error('❌ Error running seeders', err);
});
