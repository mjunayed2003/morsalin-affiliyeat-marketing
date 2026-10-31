import pg from 'pg';
const { Client } = pg;

async function testConnection(url) {
  console.log('Testing:', url.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT count(*) FROM "products"');
    console.log('Product count:', res.rows[0]);
    const products = await client.query('SELECT id, title, "createdAt" FROM "products" ORDER BY "createdAt" DESC');
    console.log('Products:', products.rows);
    await client.end();
    return true;
  } catch (err) {
    console.error('Connection failed:', err.message);
    try { await client.end(); } catch {}
    return false;
  }
}

async function run() {
  const urls = [
    "postgresql://postgres.sohqomtegbrxxyyvntwm:morsalin-affiliat-markating@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
    "postgresql://postgres.sohqomtegbrxxyyvntwm:morsalin-affiliat-markating@aws-0-eu-west-1.pooler.supabase.com:6543/postgres",
    "postgresql://postgres:morsalin-affiliat-markating@db.sohqomtegbrxxyyvntwm.supabase.co:5432/postgres",
    "postgresql://postgres:morsalin-affiliat-markating@db.sohqomtegbrxxyyvntwm.supabase.co:6543/postgres"
  ];

  for (const u of urls) {
    const ok = await testConnection(u);
    if (ok) break;
  }
}

run();

