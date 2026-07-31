import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES } from '../languages';
import { color, radius, space, type } from '../theme';

interface Props {
  visible: boolean;
  selected: string;
  title: string;
  onSelect: (code: string) => void;
  onClose: () => void;
  testIDPrefix: string;
}

export function LanguageSheet({
  visible,
  selected,
  title,
  onSelect,
  onClose,
  testIDPrefix,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.backdrop}>
        <SafeAreaView edges={['bottom']} style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            <Pressable onPress={onClose} testID={`${testIDPrefix}-close`} hitSlop={12}>
              <Text style={s.close}>Done</Text>
            </Pressable>
          </View>

          <FlatList
            data={LANGUAGES}
            keyExtractor={(l) => l.code}
            renderItem={({ item }) => {
              const active = item.code === selected;
              return (
                <Pressable
                  testID={`${testIDPrefix}-${item.code}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[s.row, active && s.rowActive]}
                  onPress={() => {
                    onSelect(item.code);
                    onClose();
                  }}
                >
                  <Text style={s.code}>{item.code.toUpperCase()}</Text>
                  <View style={s.names}>
                    <Text style={s.name}>{item.name}</Text>
                    <Text style={s.native}>{item.native}</Text>
                  </View>
                  {active && <View style={s.dot} />}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: color.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '78%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.seam,
  },
  title: { ...type.label, color: color.textMuted, textTransform: 'uppercase' },
  close: { ...type.caption, color: color.accent, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  rowActive: { backgroundColor: color.surfaceLift },
  code: {
    ...type.label,
    color: color.accent,
    width: 34,
    fontVariant: ['tabular-nums'],
  },
  names: { flex: 1 },
  name: { ...type.caption, color: color.text, fontSize: 16 },
  native: { ...type.caption, color: color.textFaint, marginTop: 1 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
  },
});
