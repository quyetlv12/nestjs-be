import { DataSource } from 'typeorm';
import { Video } from '../../modules/videos/entities/video.entity';
import { User } from '../../modules/users/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';

export const seedVideos = async (dataSource: DataSource) => {
  const videoRepo = dataSource.getRepository(Video);
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);

  // Lấy talent user
  const talent = await userRepo.findOne({ where: { email: 'talent@example.com' } });
  if (!talent) {
    console.warn('⚠️ Talent user not found');
    return;
  }

  // Lấy category
  const category = await categoryRepo.findOne({ where: { id: 1 } });
  if (!category) {
    console.warn('⚠️ Category not found');
    return;
  }

  const videos = [
    {
      title: 'Talent Music Video',
      videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '3:30',
      createdBy: talent,
      createdById: talent.id,
      categoryId: category.id, // Nếu có quan hệ category-video
      thumbnailLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      price: 100000,
      hide_video: false,
    },
  ];

  for (const v of videos) {
    const exists = await videoRepo.findOneBy({ title: v.title });
    if (!exists) {
      await videoRepo.save(videoRepo.create(v));
      console.log(`✅ Seeded video: ${v.title}`);
    }
  }
}; 