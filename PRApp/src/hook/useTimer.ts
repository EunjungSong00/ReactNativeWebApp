import {useEffect, useState, useCallback} from 'react';

const useTimer = ({minute, second}: {minute: number; second: number}) => {
  const [minutes, setMinutes] = useState(minute);
  const [seconds, setSeconds] = useState(second);

  const reset = useCallback(() => {
    setMinutes(minute);
    setSeconds(second);
  }, [minute, second]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds((val) => val - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
        } else {
          setMinutes((val) => val - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return {minutes, seconds, reset};
};

export default useTimer;
