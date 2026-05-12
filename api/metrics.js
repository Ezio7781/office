import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const DEFAULT_DATA = {
  alpha: { achieved: 0, target: 10, name: 'Team Alpha' },
  rebel: { achieved: 0, target: 10, name: 'Team Rebel' },
  total: { achieved: 0, target: 20, name: 'Branch Total' }
};

async function getSalesData() {
  let data = await redis.get('sales-data');
  if (!data) {
    await redis.set('sales-data', JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
  return JSON.parse(data);
}

async function updateSalesData(newData) {
  let data = await getSalesData();
  data.alpha = newData.alpha || data.alpha;
  data.rebel = newData.rebel || data.rebel;
  data.total = newData.total || {
    achieved: data.alpha.achieved + data.rebel.achieved,
    target: data.alpha.target + data.rebel.target,
    name: 'Branch Total'
  };
  await redis.set('sales-data', JSON.stringify(data));
  return data;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await getSalesData();
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const data = await updateSalesData(req.body);
      return res.status(200).json(data);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
}