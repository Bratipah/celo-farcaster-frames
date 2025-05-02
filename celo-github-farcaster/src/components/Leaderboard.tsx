import { FC } from 'react';

type User = {
  username: string;
  contributions: number;
};

type Props = {
  users: User[];
};

const Leaderboard: FC<Props> = ({ users }) => (
  <div>
    <h2>Top Contributors This Week</h2>
    <ol>
      {users.map((user, i) => (
        <li key={i}>{user.username} - {user.contributions} contributions</li>
      ))}
    </ol>
  </div>
);

export default Leaderboard;
