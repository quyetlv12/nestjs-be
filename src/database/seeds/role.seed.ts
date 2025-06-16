import { Permission } from '@/modules/permissions/entities/permission.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { DataSource } from 'typeorm';

export const seedRolesAndPermissions = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  const roles = [
    'guest',
    'user',
    'talent',
    'business',
    'mod',
    'admin'
  ];

  const permissions = [
    { name: 'approve_business', description: 'Phê duyệt tài khoản doanh nghiệp' },
    { name: 'approve_talent', description: 'Phê duyệt tài khoản người tài năng' },
    { name: 'handle_complaint', description: 'Xử lý khiếu nại của người dùng' },
    { name: 'manage_orders', description: 'Quản lý tất cả đơn hàng' },
    { name: 'manage_users', description: 'Quản lý tài khoản người dùng' },
    { name: 'manage_talents', description: 'Quản lý tài khoản người tài năng' },
    { name: 'manage_businesses', description: 'Quản lý tài khoản doanh nghiệp' },
    { name: 'add_mod', description: 'Thêm điều hành viên' },
    { name: 'remove_mod', description: 'Xóa điều hành viên' },
    { name: 'view_detail_user', description: 'Xem thông tin chi tiết người dùng' },
    { name: 'view_user_list', description: 'Xem danh sách người dùng' },
    { name: 'create_user', description: 'Tạo người dùng mới' },
    { name: 'update_user', description: 'Cập nhật thông tin người dùng' },
    { name: 'delete_user', description: 'Xóa người dùng' },
    { name: 'view_detail_talent', description: 'Xem thông tin chi tiết người tài năng' },
    { name: 'view_talent_list', description: 'Xem danh sách người tài năng' },
    { name: 'create_talent', description: 'Tạo người tài năng mới' },
    { name: 'update_talent', description: 'Cập nhật thông tin người tài năng' },
    { name: 'delete_talent', description: 'Xóa người tài năng' },
    { name: 'view_detail_business', description: 'Xem thông tin chi tiết doanh nghiệp' },
    { name: 'view_business_list', description: 'Xem danh sách doanh nghiệp' },
    { name: 'create_business', description: 'Tạo doanh nghiệp mới' },
    { name: 'update_business', description: 'Cập nhật thông tin doanh nghiệp' },
    { name: 'delete_business', description: 'Xóa doanh nghiệp' },
  ];

  const rolePermissions: Record<string, string[]> = {
    guest: [
      'view_talent_list',
      'view_talent_profile'
    ],
    user: [
      'book_video',
      'chat_with_talent',
      'receive_video',
      'rate_talent'
    ],
    talent: [
      'receive_order',
      'chat_with_talent',
      'upload_video',
      'earn_money'
    ],
    business: [
      'receive_order',
      'chat_with_talent',
      'upload_video',
      'earn_money',
      'create_multiple_talent'
    ],
    mod: [
      'approve_business',
      'approve_talent',
      'handle_complaint',
      'manage_orders',
      'manage_users',
      'manage_talents',
      'manage_businesses'
    ],
    admin: [
      'approve_business',
      'approve_talent',
      'handle_complaint',
      'manage_orders',
      'manage_users',
      'manage_talents',
      'manage_businesses',
      'add_mod',
      'remove_mod',
      'view_detail_user',
      'view_user_list',
      'create_user',
      'update_user',
      'delete_user',
      'view_detail_talent',
      'view_talent_list',
      'create_talent',
      'update_talent',
      'delete_talent',
      'view_detail_business',
      'view_business_list',
      'create_business',
      'update_business',
      'delete_business',
    ]
  };

  // Insert permissions
  const permissionEntities: Permission[] = [];
  for (const perm of permissions) {
    let existing = await permissionRepo.findOneBy({ name: perm.name });
    if (!existing) {
      existing = permissionRepo.create({ 
        name: perm.name,
        description: perm.description 
      });
      await permissionRepo.save(existing);
    }
    permissionEntities.push(existing);
  }

  // Insert roles with permissions
  for (const roleName of roles) {
    let role = await roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions']
    });

    if (!role) {
      role = roleRepo.create({ name: roleName });
    }

    const perms = rolePermissions[roleName] || [];
    const permsToAssign = permissionEntities.filter(p => perms.includes(p.name));

    role.permissions = permsToAssign;
    await roleRepo.save(role);
  }

  console.log('✅ Seeded roles and permissions!');
};
