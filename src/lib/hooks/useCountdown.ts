'use client';

import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(): CountdownTime {
  const [time, setTime] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function getTimeUntilMidnight(): CountdownTime {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { hours, minutes, seconds };
    }

    setTime(getTimeUntilMidnight());
    const timer = setInterval(() => {
      setTime(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
}
