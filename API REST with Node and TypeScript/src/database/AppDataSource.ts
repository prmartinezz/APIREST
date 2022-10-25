import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    type: 'mongodb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    synchronize: true,
    entities: ['./src/entities/*.ts'],
    useUnifiedTopology: true
});

export { AppDataSource };
