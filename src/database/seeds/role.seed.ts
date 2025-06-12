import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { DataSource, ILike, In } from 'typeorm';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  // Get all permissions for admin role
  const allPermissions = await permissionRepo.find({});

  // find permisson view 
  const userPermissions = await permissionRepo.find({
    where : {
      name : ILike('%view%')
    }
  });


  // Define default roles
  const roles = [
    { 
      name: 'Admin', 
      description: 'Quản trị viên với toàn quyền quản lý hệ thống',
      permissions: allPermissions
    },
    { 
      name: 'Editor', 
      description: 'Biên tập viên với quyền quản lý nội dung',
      permissions: await permissionRepo.findBy({ name: In(['view_user', 'view_role']) })
    },
    { 
      name: 'User', 
      description: 'Người dùng thông thường',
      permissions: userPermissions
    },
  ];

  for (const role of roles) {
    const exists = await roleRepo.findOneBy({ name: role.name });
    if (!exists) {
      await roleRepo.save(role);
    }
  }

  console.log('✅ Seeded roles!');
};