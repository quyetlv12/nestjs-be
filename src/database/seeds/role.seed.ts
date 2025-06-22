import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { DataSource } from 'typeorm';

export const seedRolesAndPermissions = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  // Define roles with their descriptions
  const roleDefinitions = [
    { name: 'guest', description: 'Khách truy cập - chỉ xem nội dung cơ bản' },
    { name: 'user', description: 'Người dùng thường - có thể tạo đơn hàng và bình luận' },
    { name: 'talent', description: 'Talent - có thể tạo video và quản lý đơn hàng' },
    { name: 'business', description: 'Doanh nghiệp - tương tự talent với khả năng mở rộng' },
    { name: 'mod', description: 'Moderator - quản lý nội dung và người dùng' },
    { name: 'admin', description: 'Administrator - toàn quyền hệ thống' }
  ];

  // Define role permissions mapping with better organization
  const rolePermissions: Record<string, string[]> = {
    guest: [
      'view_category',
      'view_video', 
      'view_comment',
    ],
    user: [
      // Basic content permissions
      'view_category',
      'view_video',
      'view_comment',
      'create_comment',
      'update_comment',
      'delete_comment',
      
      // Order management
      'create_order',
      'view_order_list',
      'view_order_detail', 
      'update_order',
      'delete_order',
    ],
    talent: [
      // Content permissions
      'view_category',
      'view_video',
      'view_comment',
      'create_comment',
      'update_comment',
      'delete_comment',
      
      // Video management
      'create_video',
      'update_video',
      'delete_video',
      
      // Order management
      'view_order_list',
      'view_order_detail',
      'update_order_status',
      'update_video_link',
      
      // File management
      'upload_file',
      'delete_file',
    ],
    business: [
      // Content permissions
      'view_category',
      'view_video',
      'view_comment',
      'create_comment',
      'update_comment',
      'delete_comment',
      
      // Video management
      'create_video',
      'update_video',
      'delete_video',
      
      // Order management
      'view_order_list',
      'view_order_detail',
      'update_order_status',
      'update_video_link',
      
      // File management
      'upload_file',
      'delete_file',
    ],
    mod: [
      // User management
      'view_user',
      'view_user_list',
      'update_user',
      
      // Talent management
      'view_talent',
      'update_talent',
      
      // Content management
      'view_category',
      'view_video',
      'view_comment',
      'update_comment',
      'delete_comment',
      
      // Order management
      'view_all_orders',
      'update_order_status',
      'update_payment_status',
      'update_video_link',
      
      // File management
      'upload_file',
      'delete_file',
    ],
    admin: [
      // User management
      'view_user',
      'view_user_list',
      'create_user',
      'update_user',
      'delete_user',
      
      // Role management
      'view_role',
      'create_role',
      'update_role',
      'delete_role',
      'view_detail_role',
      'assign_role',
      
      // Permission management
      'view_permission',
      'create_permission',
      'edit_permission',
      'delete_permission',
      'view_detail_permission',
      'manage_permission',
      
      // Talent management
      'create_talent',
      'view_talent',
      'update_talent',
      'delete_talent',
      
      // Video management
      'create_video',
      'view_video',
      'update_video',
      'delete_video',
      
      // Category management
      'create_category',
      'view_category',
      'update_category',
      'delete_category',
      
      // Comment management
      'create_comment',
      'view_comment',
      'update_comment',
      'delete_comment',
      
      // Order management
      'create_order',
      'view_order_list',
      'view_order_detail',
      'update_order',
      'delete_order',
      'view_all_orders',
      'update_all_orders',
      'delete_all_orders',
      'update_order_status',
      'update_payment_status',
      'update_video_link',
      
      // File management
      'upload_file',
      'delete_file',
    ]
  };

  // Create roles first
  for (const roleDef of roleDefinitions) {
    let role = await roleRepo.findOne({
      where: { name: roleDef.name }
    });

    if (!role) {
      role = roleRepo.create({
        name: roleDef.name,
        description: roleDef.description
      });
      await roleRepo.save(role);
      console.log(`✅ Created role: ${roleDef.name} - ${roleDef.description}`);
    } else {
      console.log(`ℹ️ Role ${roleDef.name} already exists`);
    }
  }

  // Assign permissions to roles
  for (const roleName of Object.keys(rolePermissions)) {
    const role = await roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions']
    });

    if (!role) {
      console.warn(`⚠️ Role '${roleName}' not found, skipping permission assignment`);
      continue;
    }

    const permissionNames = rolePermissions[roleName] || [];
    const permissions: Permission[] = [];
    
    // Find and collect permissions
    for (const permName of permissionNames) {
      const permission = await permissionRepo.findOneBy({ name: permName });
      if (permission) {
        permissions.push(permission);
      } else {
        console.warn(`⚠️ Permission '${permName}' not found for role '${roleName}'`);
      }
    }

    // Assign permissions to role
    role.permissions = permissions;
    await roleRepo.save(role);
    console.log(`✅ Assigned ${permissions.length} permissions to role: ${roleName}`);
  }

  console.log('🎉 Successfully seeded roles and permissions!');
};
