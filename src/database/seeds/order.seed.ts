import { Order } from '../../modules/orders/entities/order.entity';
import { User } from '../../modules/users/user.entity';
import { DataSource } from 'typeorm';

// Các giá trị enum mapping đúng với migration
const VIDEO_PROTOCOL_METHOD = {
  '24hours': '24hours',
  '7days': '7days',
};
const RECIPIENT = {
  SOMEONE_ELSE: 'someone_else',
  MYSELF: 'myself',
};
const ORDER_STATUS = {
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  PAID: 'paid',
  PROCESSING: 'processing',
  SENT_VIDEO: 'sent_video',
  COMPLETED: 'completed',
  COMPLAINT: 'complaint',
  RESOLVING: 'resolving',
  REFUNDED: 'refunded',
  REJECTED: 'rejected',
};

const PAYMENT_METHOD = {
  CREDIT_CARD: 'CREDIT_CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOMO: 'MOMO',
};

export const seedOrders = async (dataSource: DataSource) => {
  const orderRepo = dataSource.getRepository(Order);
  const userRepo = dataSource.getRepository(User);

  // Lấy users
  const user = await userRepo.findOne({ where: { email: 'user@example.com' } });
  const talent = await userRepo.findOne({ where: { email: 'talent@example.com' } });

  if (!user || !talent) {
    console.warn('⚠️ User or talent not found');
    return;
  }

  const orders = [
    {
      type: 'birthday_video',
      email: 'customer1@example.com',
      video_protocol_method: '7days',
      talentId: talent.id,
      recipient: RECIPIENT.SOMEONE_ELSE,
      for_gender: 'female',
      status: ORDER_STATUS.PENDING,
      price: 150000,
      paymentMethod: 'credit_card',
      request_details: 'Tôi muốn một video chúc mừng sinh nhật cho bạn gái tôi. Cô ấy thích nhạc pop và màu hồng.',
      example_video_link: 'https://www.youtube.com/watch?v=example1',
      video_from: 'Nguyễn Văn A',
      video_from_gender: 'male',
      hide_video_from: false,
      video_link: '',
      userId: user.id,
    },
  ];

  // for (const orderData of orders) {
  //   const exists = await orderRepo.findOneBy({
  //     email: orderData.email,
  //     type: orderData.type,
  //   });

  //   if (!exists) {
  //     const order = orderRepo.create(orderData);
  //     await orderRepo.save(order);
  //     console.log(`✅ Seeded order: ${orderData.type} for ${orderData.email}`);
  //   } else {
  //     console.log(`ℹ️ Order ${orderData.type} for ${orderData.email} already exists`);
  //   }
  // }

  console.log(`🎉 Seeded ${orders.length} orders`);
};

// Chạy độc lập nếu file được execute trực tiếp
if (require.main === module) {
  import('../typeorm.config').then(async (config) => {
    const dataSource = config.default;
    await dataSource.initialize();
    console.log('🔁 Running order seeder...');
    await seedOrders(dataSource);
    await dataSource.destroy();
    console.log('🌱 Done seeding orders');
  }).catch((err) => {
    console.error('❌ Error running order seeder', err);
  });
}