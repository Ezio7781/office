let salesData = {
  alpha: { achieved: 0, target: 10, name: 'Team Alpha' },
  rebel: { achieved: 0, target: 10, name: 'Team Rebel' },
  total: { achieved: 0, target: 20, name: 'Branch Total' }
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(salesData);
  } else if (req.method === 'POST') {
    const newData = req.body;
    salesData.alpha = newData.alpha || salesData.alpha;
    salesData.rebel = newData.rebel || salesData.rebel;
    salesData.total = newData.total || {
      achieved: salesData.alpha.achieved + salesData.rebel.achieved,
      target: salesData.alpha.target + salesData.rebel.target,
      name: 'Branch Total'
    };
    res.status(200).json(salesData);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}