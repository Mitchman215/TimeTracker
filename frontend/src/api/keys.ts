// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type PublishableKey = {
  publishableKey: string | undefined
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublishableKey>
) {
  if (req.method === 'GET') {
    res.status(200).json({ publishableKey: process.env.FIREBASE_API_KEY });
  } else {
    res.status(405).end('Method not allowed');
  }
}
