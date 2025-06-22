import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

export const seedCategories = async (dataSource: DataSource) => {
  const categoryRepo = dataSource.getRepository(Category);
  const categories = [
    {
      name: 'Actors',
      description: 'Famous actors from movies and TV',
      slug: 'actors',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/4nEUBFeVG_avatar--HPX4iUtK.jpg',
    },
    {
      name: 'Reality TV',
      description: 'Stars from reality television',
      slug: 'reality-tv',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/sTGMTZ6JA_avatar-1724166228938.jpg',
    },
    {
      name: 'Athletes',
      description: 'Professional sports athletes',
      slug: 'athletes',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/XM36DZcZf_ScreenShot2019-08-12at10.36.26AM.png',
    },
    {
      name: 'Comedians',
      description: 'Stand-up and comedic performers',
      slug: 'comedians',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/vd0-X50Cr_avatar-Q5zpD9Ef2.jpg',
    },
    {
      name: 'Musicians',
      description: 'Singers, bands, and music artists',
      slug: 'musicians',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/h_lFq08bN_BuY8gTjly_05672F00-E67C-42A1-AA0A-955366EE99CC.jpeg',
    },
    {
      name: 'Creators',
      description: 'Content creators and influencers',
      slug: 'creators',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/FqldwtFW2_avatar-1684593716730.jpg',
    },
    {
      name: 'For business',
      description: 'Business leaders and entrepreneurs',
      slug: 'for-business',
      thumbnail: 'https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=225,height=225/https://cdn.cameo.com/resizer/iSWnCxDlA_PB9JNJr1s.jpg',
    },
  ];

  for (const cat of categories) {
    const exists = await categoryRepo.findOneBy({ slug: cat.slug });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create(cat));
      console.log(`✅ Seeded category: ${cat.name}`);
    }
  }
};