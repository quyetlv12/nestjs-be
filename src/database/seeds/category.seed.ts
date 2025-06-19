import { DataSource } from 'typeorm';
import { Category } from '@/modules/categories/entities/category.entity';

export const seedCategories = async (dataSource: DataSource) => {
  const categoryRepo = dataSource.getRepository(Category);
  const categories = [
    { name: 'Music', description: 'Music videos', slug: 'music' , thumbnail : "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
    { name: 'Education', description: 'Educational videos', slug: 'education' , thumbnail : "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
    { name: 'Comedy', description: 'Comedy videos', slug: 'comedy' , thumbnail : "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
    { name: 'Sports', description: 'Sports videos', slug: 'sports' , thumbnail : "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
  ];

  for (const cat of categories) {
    const exists = await categoryRepo.findOneBy({ slug: cat.slug });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create(cat));
      console.log(`✅ Seeded category: ${cat.name}`);
    }
  }
}; 