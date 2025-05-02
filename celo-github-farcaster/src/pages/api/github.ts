// /pages/api/github.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ContributionData = {
  [key: string]: number;
};

type WeeklyContribution = {
  week: number;
  contributions: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid username' });
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/events/public`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });

    const contributions: ContributionData = response.data
      .filter((event: any) => event.type === 'PushEvent')
      .reduce((acc: ContributionData, event: any) => {
        const date = new Date(event.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + event.payload.commits.length;
        return acc;
      }, {});

    // Calculate weekly contributions
    const weeklyContributions: WeeklyContribution[] = [];
    let weekContributions: number[] = [];
    let weekNumber = 0;

    Object.keys(contributions).forEach((date, idx) => {
      const dateObj = new Date(date);
      const week = Math.floor(dateObj.getDate() / 7); // Get the week number of the month

      if (weekContributions.length === 7 || idx === Object.keys(contributions).length - 1) {
        weeklyContributions.push({ week: weekNumber, contributions: weekContributions.reduce((sum, day) => sum + day, 0) });
        weekContributions = [];
        weekNumber++;
      }

      weekContributions.push(contributions[date]);
    });

    res.status(200).json({ contributions, weeklyContributions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
}
