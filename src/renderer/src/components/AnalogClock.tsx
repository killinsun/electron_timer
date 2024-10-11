const AnalogClock = ({ size = 128 }) => {
  const radius = size / 2 - 10;
  const center = size / 2;

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
      {[...Array(12)].map((item, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const padding = size / 10; // サイズの1/8を内側の余白として使用
        const numberX = center + (radius - padding) * Math.cos(angle);
        const numberY = center + (radius - padding) * Math.sin(angle);
        return (
          <text
            key={`number_${item}`}
            x={numberX}
            y={numberY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size / 15}
            fontWeight="bold"
          >
            {i === 0 ? "12" : i}
          </text>
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
