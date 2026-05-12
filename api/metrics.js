import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const alphaAchieved = await redis.get('alpha_achieved') || 0;
      const alphaTarget = await redis.get('alpha_target') || 10;
      const rebelAchieved = await redis.get('rebel_achieved') || 0;
      const rebelTarget = await redis.get('rebel_target') || 10;

      return res.status(200).json({
        alpha: { achieved: Number(alphaAchieved), target: Number(alphaTarget), name: 'Team Alpha' },
        rebel: { achieved: Number(rebelAchieved), target: Number(rebelTarget), name: 'Team Rebel' },
        total: { 
          achieved: Number(alphaAchieved) + Number(rebelAchieved), 
          target: Number(alphaTarget) + Number(rebelTarget), 
          name: 'Branch Total' 
        }
      });
    } else if (req.method === 'POST') {
      const newData = req.body;
      
      if (newData.alpha) {
        if (newData.alpha.achieved !== undefined) await redis.set('alpha_achieved', newData.alpha.achieved);
        if (newData.alpha.target !== undefined) await redis.set('alpha_target', newData.alpha.target);
      }
      
      if (newData.rebel) {
        if (newData.rebel.achieved !== undefined) await redis.set('rebel_achieved', newData.rebel.achieved);
        if (newData.rebel.target !== undefined) await redis.set('rebel_target', newData.rebel.target);
      }

      const alphaAchieved = await redis.get('alpha_achieved') || 0;
      const alphaTarget = await redis.get('alpha_target') || 10;
      const rebelAchieved = await redis.get('rebel_achieved') || 0;
      const rebelTarget = await redis.get('rebel_target') || 10;

      return res.status(200).json({
        alpha: { achieved: Number(alphaAchieved), target: Number(alphaTarget), name: 'Team Alpha' },
        rebel: { achieved: Number(rebelAchieved), target: Number(rebelTarget), name: 'Team Rebel' },
        total: { 
          achieved: Number(alphaAchieved) + Number(rebelAchieved), 
          target: Number(alphaTarget) + Number(rebelTarget), 
          name: 'Branch Total' 
        }
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
}