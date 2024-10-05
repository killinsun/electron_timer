const AnalogClock = () => {
  const radius = 80;
  const center = radius + 10;
  const size = (radius + 10) * 2;

  const now = new Date();
  const secondsAngle =
    ((now.getSeconds() + now.getMilliseconds() / 1000) * 6) % 360;
  const minutesAngle = ((now.getMinutes() + now.getSeconds() / 60) * 6) % 360;
  const hoursAngle =
    (((now.getHours() % 12) + now.getMinutes() / 60) * 30) % 360;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = center + (radius - 5) * Math.sin(angle);
        const y1 = center - (radius - 5) * Math.cos(angle);
        const x2 = center + radius * Math.sin(angle);
        const y2 = center - radius * Math.cos(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="2"
          />
        );
      })}
      <line
        x1={center}
        y1={center}
        x2={center + radius * 0.5 * Math.sin((hoursAngle * Math.PI) / 180)}
        y2={center - radius * 0.5 * Math.cos((hoursAngle * Math.PI) / 180)}
        stroke="black"
        strokeWidth="3"
      />
      <line
        x1={center}
        y1={center}
        x2={center + radius * 0.7 * Math.sin((minutesAngle * Math.PI) / 180)}
        y2={center - radius * 0.7 * Math.cos((minutesAngle * Math.PI) / 180)}
        stroke="black"
        strokeWidth="2"
      />
      <line
        x1={center}
        y1={center}
        x2={center + radius * 0.9 * Math.sin((secondsAngle * Math.PI) / 180)}
        y2={center - radius * 0.9 * Math.cos((secondsAngle * Math.PI) / 180)}
        stroke="red"
        strokeWidth="1"
      />
    </svg>
  );
};

export default AnalogClock;
