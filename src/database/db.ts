// src/app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

export const dbConnect = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost', // Hoặc địa chỉ MySQL server
  port: 3306, // Port mặc định của MySQL
  username: 'root', // Username MySQL
  password: '', // Password MySQL
  database: 'nest_db', // Tên database
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Đường dẫn đến các entity
  synchronize: true, // Tự động tạo bảng (chỉ dùng cho môi trường dev)
});
