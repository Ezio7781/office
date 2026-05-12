import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get current metrics from Redis
      let data = await redis.get('sales-data');
      
      // Initialize default data if not present
      if (!data) {
        data = {
          alpha: { achieved: 0, target: 10, name: 'Team Alpha' },
          rebel: { achieved: 0, target: 10, name: 'Team Rebel' },
          total: { achieved: 0, target: 20, name: 'Branch Total' }
        };
        await redis.set('sales-data', JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const newData = req.body;
      
      // Get existing data or initialize
      let existingData = await redis.get('sales-data');
      existingData = existingData ? JSON.parse(existingData) : {
        alpha: { achieved: 0, target: 10, name: 'Team Alpha' },
        rebel: { achieved: 0, target: 10, name: 'Team Rebel' },
        total: { achieved: 0, target: 20, name: 'Branch Total' }
      };
      
      // Update with new data
      existingData.alpha = newData.alpha || existingData.alpha;
      existingData.rebel = newData.rebel || existingData.rebel;
      existingData.total = newData.total || {
        achieved: existingData.alpha.achieved + existingData.rebel.achieved,
        target: existingData.alpha.target + existingData.rebel.target,
        name: 'Branch Total'
      };
      
      // Save back to Redis
      await redis.set('sales-data', JSON.stringify(existingData));
      
      return res.status(200).json(existingData);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
}