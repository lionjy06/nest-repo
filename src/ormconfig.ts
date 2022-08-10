import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/apis/**/*.entity.*'],
  synchronize: process.env.NODE_ENV === 'production',
  logging: true,
  dropSchema: false,
});

export default AppDataSource;
