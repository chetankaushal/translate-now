import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguageSheet } from '../src/components/LanguageSheet';
import { byCode } from '../src/languages';
import { useTranslation } from '../src/store/translation';
import { color, radius, space, type } from '../src/theme';

export default function Translate() {
  const {
    from, to, input, output, status, error, engine,
    setInput, setFrom, setTo, swap, translate,
  } = useTranslation();

  const [sheet, setSheet] = useState<'from' | 'to' | null>(null);
  const busy = status === 'translating';

  const onSwap = () => {
    Haptics.selectionAsync().catch(() => {});
    swap();
  };

  const onCopy = async () => {
    if (!output) return;
    await Clipboard.setStringAsync(output);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <SafeAreaView style={s.root} testID="screen-translate">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.topbar}>
          <Text style={s.wordmark}>TRANSLATE NOW</Text>
          <Link href="/history" asChild>
            <Pressable testID="open-history" hitSlop={12}>
              <Text style={s.topLink}>History</Text>
            </Pressable>
          </Link>
        </View>

        {/* SOURCE */}
        <View style={s.panel}>
          <Pressable
            testID="picker-from"
            style={s.langButton}
            onPress={() => setSheet('from')}
          >
            <Text style={s.langCode}>{from.toUpperCase()}</Text>
            <Text style={s.langName}>{byCode(from).name}</Text>
          </Pressable>

          <TextInput
            testID="input-source"
            style={s.text}
            value={input}
            onChangeText={setInput}
            placeholder="Type something to translate"
            placeholderTextColor={color.textFaint}
            multiline
            autoCorrect
            textAlignVertical="top"
          />
        </View>

        {/* THE SEAM — the boundary the whole app is about */}
        <View style={s.seam}>
          <View style={s.seamLine} />
          <Pressable
            testID="swap-languages"
            accessibilityLabel="Swap languages"
            style={s.swap}
            onPress={onSwap}
            hitSlop={10}
          >
            <Text style={s.swapGlyph}>⇅</Text>
          </Pressable>
          <View style={s.seamLine} />
        </View>

        {/* TARGET */}
        <View style={s.panel}>
          <Pressable testID="picker-to" style={s.langButton} onPress={() => setSheet('to')}>
            <Text style={s.langCode}>{to.toUpperCase()}</Text>
            <Text style={s.langName}>{byCode(to).name}</Text>
          </Pressable>

          <ScrollView keyboardShouldPersistTaps="handled">
            {busy ? (
              <ActivityIndicator testID="translating" color={color.accent} style={s.spinner} />
            ) : error ? (
              <Text testID="error-message" style={s.error}>
                {error}
              </Text>
            ) : (
              <Text testID="output-text" style={[s.text, !output && s.textEmpty]}>
                {output || 'Translation appears here'}
              </Text>
            )}
          </ScrollView>

          {!!output && !busy && (
            <View style={s.outputFooter}>
              <Pressable testID="copy-output" onPress={onCopy} hitSlop={8}>
                <Text style={s.footerAction}>Copy</Text>
              </Pressable>
              {!!engine && <Text style={s.engine}>{engine}</Text>}
            </View>
          )}
        </View>

        <Pressable
          testID="translate-button"
          style={[s.cta, (busy || !input.trim()) && s.ctaDisabled]}
          disabled={busy || !input.trim()}
          onPress={translate}
        >
          <Text style={s.ctaText}>{busy ? 'Translating' : 'Translate'}</Text>
        </Pressable>
      </KeyboardAvoidingView>

      <LanguageSheet
        visible={sheet === 'from'}
        selected={from}
        title="Translate from"
        testIDPrefix="lang-from"
        onSelect={setFrom}
        onClose={() => setSheet(null)}
      />
      <LanguageSheet
        visible={sheet === 'to'}
        selected={to}
        title="Translate to"
        testIDPrefix="lang-to"
        onSelect={setTo}
        onClose={() => setSheet(null)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
  },
  wordmark: { ...type.display, color: color.text },
  topLink: { ...type.caption, color: color.textMuted },

  panel: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.md },
  langButton: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
  langCode: { ...type.label, color: color.accent },
  langName: { ...type.caption, color: color.textFaint },

  text: { ...type.body, color: color.text, paddingTop: space.sm, flexGrow: 1 },
  textEmpty: { color: color.textFaint },
  spinner: { alignSelf: 'flex-start', marginTop: space.md },
  error: { ...type.caption, color: color.danger, marginTop: space.md, lineHeight: 20 },

  outputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
  },
  footerAction: { ...type.label, color: color.accent },
  engine: { ...type.label, color: color.textFaint, fontSize: 10 },

  seam: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg },
  seamLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: color.seam },
  swap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.seam,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: space.md,
  },
  swapGlyph: { color: color.accent, fontSize: 18, lineHeight: 22 },

  cta: {
    margin: space.lg,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: color.accentDim },
  ctaText: { ...type.label, color: color.ground, fontSize: 14 },
});
