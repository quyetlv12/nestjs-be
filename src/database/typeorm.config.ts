// src/database/typeorm.config.ts
import { dbConfig } from 'src/config/dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
};


// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   url: 'postgresql://neondb_owner:npg_xwEqPY3O2fkm@ep-snowy-brook-a1f15tjg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
//   ssl: {
//     rejectUnauthorized: false, // Neon yêu cầu SSL
//   },
//   synchronize: true, // ❗Chỉ dùng khi dev
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/migrations/*{.ts,.js}'],
// };




const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
