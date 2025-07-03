// src/database/typeorm.config.ts
import { dbConfig } from 'src/config/dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: dbConfig.username,
//   password: dbConfig.password,
//   database: dbConfig.database,
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/migrations/*{.ts,.js}'],
//   synchronize: false,
// };


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: 'postgresql://cammeo_owner:npg_Rfy2LJaYeT6H@ep-sparkling-paper-a8kk0u2d-pooler.eastus2.azure.neon.tech/cammeo?sslmode=require',
  ssl: {
    rejectUnauthorized: false, // Neon yêu cầu SSL
  },
  synchronize: false, // ❗Chỉ dùng khi dev
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};




const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
