import dataSource from '../typeorm.config';
import { seedRolesAndPermissions } from './role.seed';
import { seedUsers } from './user.seed';
import { seedCategories } from './category.seed';
import { seedVideos } from './video.seed';
import { seedComments } from './comment.seed';
import { seedTalents } from './talent.seed';

dataSource.initialize().then(async () => {
  console.log('🔁 Running seeders...');
  await seedRolesAndPermissions(dataSource);
  await seedUsers(dataSource);
  await seedCategories(dataSource);
  await seedVideos(dataSource);
  await seedComments(dataSource);
  await seedTalents(dataSource);
  await dataSource.destroy();
  console.log('🌱 Done seeding');
}).catch((err) => {
  console.error('❌ Error running seeders', err);
});
