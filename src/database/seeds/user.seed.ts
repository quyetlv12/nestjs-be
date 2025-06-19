import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/user.entity';
import { Role } from '@/modules/roles/entities/role.entity';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const roles = ['guest', 'user', 'talent', 'business', 'mod', 'admin'];
  const plainPassword = '123456789';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  for (const roleName of roles) {
    const role = await roleRepo.findOneBy({ name: roleName });

    if (!role) {
      console.warn(`⚠️ Role '${roleName}' not found, skipping user creation`);
      continue;
    }

    const email = `${roleName}@example.com`;

    const existing = await userRepo.findOneBy({ email });
    if (existing) {
      console.log(`ℹ️ User ${email} already exists`);
      continue;
    }

    const user = userRepo.create({
      name: roleName,
      email,
      nick_name : roleName,
      status : "active",
      password: hashedPassword,
      roles: [role],
    });

    await userRepo.save(user);
    console.log(`✅ Created user: ${email}`);
  }
};
