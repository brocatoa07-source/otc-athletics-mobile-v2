import { View, StyleSheet } from 'react-native';
import React from 'react';

interface IconGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function IconGrid({ children, columns = 2 }: IconGridProps) {
  const childArray = React.Children.toArray(children);

  return (
    <View style={styles.grid}>
      {childArray.map((child, i) => (
        <View
          key={i}
          style={[
            styles.cell,
            columns === 2 ? styles.cell2 : styles.cell3,
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {},
  cell2: {
    width: '48%' as any,
    flexGrow: 1,
  },
  cell3: {
    width: '31%' as any,
    flexGrow: 1,
  },
});
