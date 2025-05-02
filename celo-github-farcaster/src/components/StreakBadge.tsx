import { FC } from 'react';

type Props = {
  streak: number;
  weeklyStreak: number;
  monthlyStreak: number;
};

const StreakBadge: FC<Props> = ({ streak, weeklyStreak, monthlyStreak }) => (
  <div>
    <h3>Current Streak: {streak} days</h3>
    <h4>Weekly Streak: {weeklyStreak} weeks</h4>
    <h4>Monthly Streak: {monthlyStreak} months</h4>
  </div>
);

export default StreakBadge;
