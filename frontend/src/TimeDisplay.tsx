import { useState, useEffect } from "react";

const getTimeUntilMidnight = () => {
  const now = new Date();
  
  // 日本時間に変換
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

  // 翌日の0時（日本時間）を取得
  const midnight = new Date(jstNow);
  midnight.setHours(24, 0, 0, 0); // 翌日00:00:00

  // 残り時間（ミリ秒）
  const diff = midnight.getTime() - jstNow.getTime();

  // 時間、分、秒を計算
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

export default function TimeDisplay() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time-display">
      <p>日付が変わるまでの残り時間: {timeLeft.hours}時間 {timeLeft.minutes}分 </p>
    </div>
  );
}
