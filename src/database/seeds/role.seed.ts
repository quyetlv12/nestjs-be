import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { DataSource } from 'typeorm';

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    { name: 'view_user', description: 'Xem danh sách người dùng' },
    { name: 'create_user', description: 'Tạo người dùng mới' },
    { name: 'update_user', description: 'Cập nhật thông tin người dùng' },
    { name: 'delete_user', description: 'Xoá người dùng' },
    { name: 'view_role', description: 'Xem danh sách vai trò' },
    { name: 'create_role', description: 'Tạo vai trò mới' },
    { name: 'update_role', description: 'Cập nhật vai trò' },
    { name: 'delete_role', description: 'Xoá vai trò' },
    { name: 'assign_role', description: 'Gán vai trò cho người dùng' },
    { name: 'manage_permission', description: 'Quản lý các quyền' },
  ];

  for (const perm of permissions) {
    const exists = await permissionRepo.findOneBy({ name: perm.name });
    if (!exists) {
      await permissionRepo.save(perm);
    }
  }

  console.log('✅ Seeded permissions!');
};
