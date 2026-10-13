import dataSource from '../data-source.js';
import { ScryptPasswordHasher } from '../../../../modules/users/infrastructure/security/scrypt-password-hasher.js';

const products = [
    { id: 'a1111111-1111-4111-8111-111111111111', name: 'Mechanical keyboard', description: 'Red switches, Spanish layout', priceCents: 15990, stock: 25 },
    { id: 'a2222222-2222-4222-8222-222222222222', name: 'Wireless mouse', description: 'USB receiver, 1600 DPI', priceCents: 7990, stock: 40 },
    { id: 'a3333333-3333-4333-8333-333333333333', name: '24-inch monitor', description: 'Full HD, 75 Hz', priceCents: 54990, stock: 12 },
    { id: 'a4444444-4444-4444-8444-444444444444', name: 'USB Headphones', description: 'With microphone', priceCents: 11990, stock: 30 },
    { id: 'a5555555-5555-4555-8555-555555555555', name: 'HD Webcam', description: '720p with built-in microphone', priceCents: 8990, stock: 18 },
];

async function run(): Promise<void> {
    await dataSource.initialize();
    try {
        for (const product of products) {
            await dataSource.query(
                'INSERT INTO products (id, name, description, price_cents, stock) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
                [product.id, product.name, product.description, product.priceCents, product.stock],
            );
        }

        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
            throw new Error('Define SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env');
        }
        const passwordHash = await new ScryptPasswordHasher().hash(adminPassword);
        await dataSource.query(
            'INSERT INTO users (id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
            ['b1111111-1111-4111-8111-111111111111', adminEmail.toLowerCase(), passwordHash, 'Administrador', 'admin'],
        );

        console.log(`Seed completado: ${products.length} productos`);
    } finally {
        await dataSource.destroy();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});