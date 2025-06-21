import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { DataSource } from 'typeorm';

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    // User permissions
    { name: 'view_user', description: 'Xem danh sách người dùng' },
    { name: 'view_user_list', description: 'Xem danh sách tất cả người dùng' },
    { name: 'create_user', description: 'Tạo người dùng mới' },
    { name: 'update_user', description: 'Cập nhật thông tin người dùng' },
    { name: 'delete_user', description: 'Xoá người dùng' },
    
    // Role permissions
    { name: 'view_role', description: 'Xem danh sách vai trò' },
    { name: 'view_detail_role', description: 'Xem chi tiết vai trò' },
    { name: 'create_role', description: 'Tạo vai trò mới' },
    { name: 'update_role', description: 'Cập nhật vai trò' },
    { name: 'delete_role', description: 'Xoá vai trò' },
    { name: 'assign_role', description: 'Gán vai trò cho người dùng' },
    
    // Permission permissions
    { name: 'view_permission', description: 'Xem danh sách quyền' },
    { name: 'view_detail_permission', description: 'Xem chi tiết quyền' },
    { name: 'create_permission', description: 'Tạo quyền mới' },
    { name: 'edit_permission', description: 'Chỉnh sửa quyền' },
    { name: 'delete_permission', description: 'Xóa quyền' },
    { name: 'manage_permission', description: 'Quản lý các quyền' },
    
    // Talent permissions
    { name: 'view_talent', description: 'Xem danh sách talent' },
    { name: 'create_talent', description: 'Tạo talent mới' },
    { name: 'update_talent', description: 'Cập nhật thông tin talent' },
    { name: 'delete_talent', description: 'Xóa talent' },
    
    // Video permissions
    { name: 'view_video', description: 'Xem danh sách video' },
    { name: 'create_video', description: 'Tạo video mới' },
    { name: 'update_video', description: 'Cập nhật video' },
    { name: 'delete_video', description: 'Xóa video' },
    
    // Category permissions
    { name: 'view_category', description: 'Xem danh sách danh mục' },
    { name: 'create_category', description: 'Tạo danh mục mới' },
    { name: 'update_category', description: 'Cập nhật danh mục' },
    { name: 'delete_category', description: 'Xóa danh mục' },
    
    // Comment permissions
    { name: 'view_comment', description: 'Xem bình luận' },
    { name: 'create_comment', description: 'Tạo bình luận mới' },
    { name: 'update_comment', description: 'Cập nhật bình luận' },
    { name: 'delete_comment', description: 'Xóa bình luận' },
    
    // Order permissions
    { name: 'create_order', description: 'Tạo đơn hàng mới' },
    { name: 'view_order_list', description: 'Xem danh sách đơn hàng của mình' },
    { name: 'view_order_detail', description: 'Xem chi tiết đơn hàng' },
    { name: 'update_order', description: 'Cập nhật đơn hàng của mình' },
    { name: 'delete_order', description: 'Xóa đơn hàng của mình' },
    { name: 'view_all_orders', description: 'Xem tất cả đơn hàng (Admin)' },
    { name: 'update_all_orders', description: 'Cập nhật tất cả đơn hàng (Admin)' },
    { name: 'delete_all_orders', description: 'Xóa tất cả đơn hàng (Admin)' },
    { name: 'update_order_status', description: 'Cập nhật trạng thái đơn hàng (Talent/Admin)' },
    { name: 'update_payment_status', description: 'Cập nhật trạng thái thanh toán (Admin)' },
    { name: 'update_video_link', description: 'Cập nhật link video (Talent/Admin)' },
    
    // Upload permissions
    { name: 'upload_file', description: 'Upload file' },
    { name: 'delete_file', description: 'Xóa file' },
  ];

  for (const perm of permissions) {
    const exists = await permissionRepo.findOneBy({ name: perm.name });
    if (!exists) {
      await permissionRepo.save(permissionRepo.create(perm));
      console.log(`✅ Created permission: ${perm.name}`);
    } else {
      console.log(`ℹ️ Permission ${perm.name} already exists`);
    }
  }

  console.log(`🎉 Seeded ${permissions.length} permissions`);
};
