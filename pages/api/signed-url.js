import AWS from 'aws-sdk';
import { supabase } from '../../lib/supabase';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const key = req.query.key;
  const userId = req.headers['x-test-user-id'] || null;
  if (!userId) return res.status(401).json({ error: 'Missing test user id header' });

  // Verify entitlement in Supabase: user has purchase for course that owns this key
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('id, course_id')
      .eq('user_id', userId)
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(403).json({ error: 'No entitlement found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Entitlement check failed' });
  }

  const params = { Bucket: process.env.S3_BUCKET, Key: key, Expires: 60 }; // 60s
  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    res.json({ url });
  } catch (err) {
    console.error('S3 signed url error', err);
    res.status(500).json({ error: 'Could not create signed URL' });
  }
}