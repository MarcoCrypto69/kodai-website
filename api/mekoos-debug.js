module.exports = function handler(req, res) {
  const url = process.env.REDIS_URL || '';
  const m = url.match(/rediss?:\/\/[^:]+:([^@]+)@([^:/]+)/);
  res.json({
    redis_url_set: !!url,
    redis_url_prefix: url.substring(0, 30) + '...',
    regex_match: !!m,
    host: m ? m[2] : null,
  });
};
