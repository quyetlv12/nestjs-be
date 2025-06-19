import { DataSource } from 'typeorm';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { User } from '@/modules/users/user.entity';
import { Video } from '@/modules/videos/entities/video.entity';

export const seedComments = async (dataSource: DataSource) => {
  const commentRepo = dataSource.getRepository(Comment);
  const userRepo = dataSource.getRepository(User);
  const videoRepo = dataSource.getRepository(Video);

  const user = await userRepo.findOne({ where: { email: 'user@example.com' } });
  const video = await videoRepo.findOne({ where: { title: 'Talent Music Video' } });

  if (!user || !video) {
    console.warn('⚠️ User or video not found for comment seed');
    return;
  }

  const comments = [
    {
      content: 'Great video!',
      user,
      userId: user.id,
      video,
      videoId: video.id,
    },
    {
      content: 'Amazing performance!',
      user,
      userId: user.id,
      video,
      videoId: video.id,
    },
  ];

  for (const c of comments) {
    const exists = await commentRepo.findOneBy({ content: c.content, userId: c.userId, videoId: c.videoId });
    if (!exists) {
      await commentRepo.save(commentRepo.create(c));
      console.log(`✅ Seeded comment: ${c.content}`);
    }
  }
}; 