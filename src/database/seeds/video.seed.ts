import { DataSource } from 'typeorm';
import { Video } from '../../modules/videos/entities/video.entity';
import { User } from '../../modules/users/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';

export const seedVideos = async (dataSource: DataSource) => {
  const videoRepo = dataSource.getRepository(Video);
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  // Lấy category
  const category = await categoryRepo.findOne({ where: { id: 1 } });
  if (!category) {
    console.warn('⚠️ Category not found');
    return;
  }

  const talents = [7, 8, 9, 10];

  for (const talentId of talents) {
    const talent = await userRepo.findOne({ where: { id: talentId } });
    console.log("talent" , talent);
    
    if (!talent) {
      console.warn('⚠️ Talent not found');
      continue;
    }

    const videos = [
      {
        title: 'Talent Music Video',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
        price: 100000,
        hide_video: false,
      },
      {
        title: 'Talent Music Videortyrtytr',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
        price: 100000,
        hide_video: false,
      },
      {
        title: 'Talent Music Videotỷyrt',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
        price: 100000,
        hide_video: false,
      },

      {
        title: 'Talent Music Video',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
        price: 100000,
        hide_video: false,
      },
      {
        title: 'Talent Music Videortyrtytr',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
        price: 100000,
        hide_video: false,
      },
      {
        title: 'Talent Music Videotỷyrt',
        videoLink: 'https://cdn.pixabay.com/video/2025/03/23/266987_large.mp4',
        duration: '3:30',
        createdBy: talent,
        createdById: talent.id,
        categoryId: category.id, // Nếu có quan hệ category-video
        thumbnailLink:
          'https://cdn.pixabay.com/photo/2025/06/19/16/21/adventure-9669330_1280.jpg',
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
  }
};
