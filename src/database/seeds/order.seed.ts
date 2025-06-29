import { Order, OrderStatus, RecipientType, VideoProtocolMethod } from '../../modules/orders/entities/order.entity';
import { User } from '../../modules/users/user.entity';
import { DataSource } from 'typeorm';

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
      video_protocol_method: VideoProtocolMethod.TWENTY_FOUR_HOURS,
      talentId: talent.id,
      recipient: RecipientType.SOMEONE_ELSE,
      for_gender: 'female',
      status: OrderStatus.PENDING,
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
    {
      type: 'anniversary_video',
      email: 'customer2@example.com',
      video_protocol_method: VideoProtocolMethod.SEVEN_DAYS,
      talentId: talent.id,
      recipient: RecipientType.MYSELF,
      for_gender: 'male',
      status: OrderStatus.PROCESSING,
      price: 200000,
      paymentMethod: 'bank_transfer',
      paymentDate: new Date('2024-01-15'),
      request_details: 'Video kỷ niệm 5 năm ngày cưới. Tôi muốn một video lãng mạn với nhạc ballad.',
      example_video_link: 'https://www.youtube.com/watch?v=example2',
      video_from: 'Trần Thị B',
      video_from_gender: 'female',
      hide_video_from: true,
      video_link: '',
      userId: user.id,
    },
    {
      type: 'graduation_video',
      email: 'customer3@example.com',
      video_protocol_method: VideoProtocolMethod.TWENTY_FOUR_HOURS,
      talentId: talent.id,
      recipient: RecipientType.SOMEONE_ELSE,
      for_gender: 'male',
      status: OrderStatus.COMPLETED,
      price: 180000,
      paymentMethod: 'momo',
      paymentDate: new Date('2024-01-10'),
      request_details: 'Video chúc mừng tốt nghiệp cho em trai. Em ấy vừa tốt nghiệp đại học.',
      example_video_link: 'https://www.youtube.com/watch?v=example3',
      video_from: 'Lê Văn C',
      video_from_gender: 'male',
      hide_video_from: false,
      video_link: 'https://drive.google.com/file/d/completed-video-1.mp4',
      userId: user.id,
    },
    {
      type: 'wedding_video',
      email: 'customer4@example.com',
      video_protocol_method: VideoProtocolMethod.SEVEN_DAYS,
      talentId: talent.id,
      recipient: RecipientType.SOMEONE_ELSE,
      for_gender: 'female',
      status: OrderStatus.COMPLAINT,
      price: 300000,
      paymentMethod: 'credit_card',
      paymentDate: new Date('2024-01-05'),
      request_details: 'Video chúc mừng đám cưới cho chị gái. Tôi muốn video thật đặc biệt và ý nghĩa.',
      example_video_link: 'https://www.youtube.com/watch?v=example4',
      video_from: 'Phạm Thị D',
      video_from_gender: 'female',
      hide_video_from: false,
      video_link: 'https://drive.google.com/file/d/completed-video-2.mp4',
      userId: user.id,
    },
    {
      type: 'promotion_video',
      email: 'customer5@example.com',
      video_protocol_method: VideoProtocolMethod.TWENTY_FOUR_HOURS,
      talentId: talent.id,
      recipient: RecipientType.MYSELF,
      for_gender: 'male',
      status: OrderStatus.REFUNDED,
      price: 120000,
      paymentMethod: 'bank_transfer',
      request_details: 'Video chúc mừng thăng chức cho đồng nghiệp. Anh ấy vừa được thăng làm trưởng phòng.',
      example_video_link: 'https://www.youtube.com/watch?v=example5',
      video_from: 'Hoàng Văn E',
      video_from_gender: 'male',
      hide_video_from: true,
      video_link: '',
      userId: user.id,
    },
    {
      type: 'retirement_video',
      email: 'customer6@example.com',
      video_protocol_method: VideoProtocolMethod.SEVEN_DAYS,
      talentId: talent.id,
      recipient: RecipientType.SOMEONE_ELSE,
      for_gender: 'male',
      status: OrderStatus.REJECTED,
      price: 250000,
      paymentMethod: 'credit_card',
      request_details: 'Video chúc mừng nghỉ hưu cho bố. Bố tôi vừa nghỉ hưu sau 30 năm làm việc.',
      example_video_link: 'https://www.youtube.com/watch?v=example6',
      video_from: 'Vũ Thị F',
      video_from_gender: 'female',
      hide_video_from: false,
      video_link: '',
      userId: user.id,
    },
  ];

  for (const orderData of orders) {
    const exists = await orderRepo.findOneBy({ 
      email: orderData.email,
      type: orderData.type 
    });
    
    if (!exists) {
      const order = orderRepo.create(orderData);
      await orderRepo.save(order);
      console.log(`✅ Seeded order: ${orderData.type} for ${orderData.email}`);
    } else {
      console.log(`ℹ️ Order ${orderData.type} for ${orderData.email} already exists`);
    }
  }

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