import { DataSource } from 'typeorm';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { User } from '@/modules/users/user.entity';
import { Video } from '@/modules/videos/entities/video.entity';

export const seedComments = async (dataSource: DataSource) => {
  const commentRepo = dataSource.getRepository(Comment);
  const userRepo = dataSource.getRepository(User);
  const videoRepo = dataSource.getRepository(Video);

  const user = await userRepo.findOne({ where: { email: 'user@example.com' } });
  const talent = await userRepo.findOne({ where: { email: 'talent@example.com' } });

  if (!user || !talent) {
    console.warn('⚠️ User or talent not found for comment seed');
    return;
  }

  const comments = [
    {
      content: 'Great video!',
      user,
      userId: user.id,
      talent,
      talentId: talent.id,
      star: 5,
    },
    {
      content: 'Amazing performance!',
      user,
      userId: user.id,
      talent,
      talentId: talent.id,
      star: 4,
    },
  ];

  for (const c of comments) {
    const exists = await commentRepo.findOneBy({ content: c.content, userId: c.userId, talentId: c.talentId });
    if (!exists) {
      await commentRepo.save(commentRepo.create(c));
      console.log(`✅ Seeded comment: ${c.content}`);
    }
  }
}; 