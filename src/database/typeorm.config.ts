import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path'; // Thêm join từ 'path' để xử lý đường dẫn

dotenv.config({ path: '.env' }); // Đảm bảo đọc biến môi trường từ .env
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'nest_db',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/**/*{.ts,.js}')],
  synchronize: false,
});