import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '@/constants/colors';

interface SparklineChartProps {
  values: number[];
  width?: number;
  height?: number;
  higherIsBetter?: boolean;
}

export function SparklineChart({
  values,
  width = 80,
  height = 30,
  higherIsBetter = true,
}: SparklineChartProps) {
  if (!values || values.length < 2) {
    return <View style={{ width, height }} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - padding * 2);
      const y = padding + ((max - v) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastTwo = values.slice(-2);
  const trending = lastTwo.length === 2 ? lastTwo[1] - lastTwo[0] : 0;
  const isGood = higherIsBetter ? trending >= 0 : trending <= 0;
  const lineColor = isGood ? Colors.success : Colors.error;

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
