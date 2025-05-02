// /pages/index.tsx
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ActivityChart from './components/ActivityChart';
import Leaderboard from './components/Leaderboard';
import StreakBadge from './components/StreakBadge';

export default function Home() {
  const { isConnected, address, connector } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string>('');
  const [data, setData] = useState<number[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ week: number; contributions: number }[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [weeklyStreak, setWeeklyStreak] = useState<number>(0);
  const [monthlyStreak, setMonthlyStreak] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<{ username: string; contributions: number }[]>([]);

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('username='));
    const savedUsername = cookie ? cookie.split('=')[1] : '';
    setUsername(savedUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`/api/github?username=${username}`)
        .then(res => res.json())
        .then(({ contributions, weeklyContributions }) => {
          const days: number[] = Object.values(contributions);
          setData(days);

          // Weekly contributions
          setWeeklyData(weeklyContributions);

          let streakCount = 0;
          for (let i:number = days.length - 1; i >= 0; i--) {
            if (days[i] > 0) streakCount++;
            else break;
          }
          setStreak(streakCount);
        });
    }
  }, [username]);

  const handleShareFrame = async () => {
    if (username) {
      const frameUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?username=${username}`;
      window.open(frameUrl, '_blank');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>GitHub Activity Tracker</h1>
      <p>Welcome, {username}!</p>

      {/* Rainbow Wallet Connection */}
      {!isConnected ? (
        <ConnectButton />
      ) : (
        <div>
          <p>Connected Wallet: {address}</p>
          <button onClick={() => disconnect()} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Disconnect
          </button>
        </div>
      )}

      {/* GitHub Username Input */}
      {!username ? (
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', width: '200px' }}
          />
          <button
            onClick={() => document.cookie = `username=${username}; path=/`}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            Set Username
          </button>
        </div>
      ) : (
        <>
          {data.length > 0 && <ActivityChart data={data} />}
          <StreakBadge streak={streak} weeklyStreak={weeklyStreak} monthlyStreak={monthlyStreak} />
          <Leaderboard users={leaderboard} />

          {/* Display Weekly Contributions */}
          <div style={{ marginTop: '20px' }}>
            <h2>Weekly Contributions</h2>
            <ul>
              {weeklyData.map((week, idx) => (
                <li key={idx}>Week {week.week}: {week.contributions} contributions</li>
              ))}
            </ul>
          </div>

          {/* Button to share the Farcaster frame */}
          <button onClick={handleShareFrame} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Share My Farcaster Frame
          </button>
        </>
      )}
    </div>
  );
}
