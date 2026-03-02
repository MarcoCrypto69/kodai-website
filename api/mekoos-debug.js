module.exports = function handler(req, res) {
  const keys = Object.keys(process.env)
    .filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH'))
    .reduce((acc, k) => {
      acc[k] = (process.env[k] || '').substring(0, 40) + '...';
      return acc;
    }, {});
  res.json({ vars: keys, count: Object.keys(keys).length });
};
