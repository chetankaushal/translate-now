import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../src/store/translation';
import { color, space, type } from '../src/theme';

export default function History() {
  const { history, clearHistory } = useTranslation();

  if (history.length === 0) {
    return (
      <View style={s.empty} testID="history-empty">
        <Text style={s.emptyTitle}>No translations yet</Text>
        <Text style={s.emptyBody}>Anything you translate shows up here.</Text>
      </View>
    );
  }

  return (
    <View style={s.root} testID="screen-history">
      <FlatList
        data={history}
        keyExtractor={(h) => h.id}
        ItemSeparatorComponent={() => <View style={s.sep} />}
        renderItem={({ item }) => (
          <View style={s.row} testID={`history-item-${item.id}`}>
            <Text style={s.pair}>
              {item.from.toUpperCase()} → {item.to.toUpperCase()}
            </Text>
            <Text style={s.source}>{item.source}</Text>
            <Text style={s.result}>{item.result}</Text>
          </View>
        )}
      />
      <Pressable testID="clear-history" style={s.clear} onPress={clearHistory}>
        <Text style={s.clearText}>Clear history</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  row: { paddingHorizontal: space.lg, paddingVertical: space.md, gap: 3 },
  pair: { ...type.label, color: color.accent, fontSize: 10 },
  source: { ...type.caption, color: color.textMuted, fontSize: 15 },
  result: { ...type.caption, color: color.text, fontSize: 17 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: color.seam },
  clear: { padding: space.lg, alignItems: 'center' },
  clearText: { ...type.label, color: color.danger },
  empty: {
    flex: 1,
    backgroundColor: color.ground,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  emptyTitle: { ...type.caption, color: color.text, fontSize: 17 },
  emptyBody: { ...type.caption, color: color.textFaint },
});
