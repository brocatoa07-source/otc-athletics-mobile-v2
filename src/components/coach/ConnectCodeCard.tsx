import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface Props {
  connectCode: string | null;
  copied: boolean;
  loading: boolean;
  onCopy: () => void;
  onGenerate: () => void;
}

export function ConnectCodeCard({ connectCode, copied, loading, onCopy, onGenerate }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="key-outline" size={18} color="#8b5cf6" />
          <Text style={styles.title}>YOUR CONNECT CODE</Text>
        </View>
        <Text style={styles.hint}>Share with athletes to link accounts</Text>
      </View>

      {connectCode ? (
        <TouchableOpacity style={styles.codeRow} onPress={onCopy} activeOpacity={0.7}>
          <Text style={styles.code}>{connectCode}</Text>
          <View style={[styles.copyBtn, copied && styles.copyBtnDone]}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={16}
              color={copied ? '#fff' : '#8b5cf6'}
            />
            <Text style={[styles.copyText, copied && styles.copyTextDone]}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.generateBtn, loading && { opacity: 0.6 }]}
          onPress={onGenerate}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={16} color="#fff" />
          <Text style={styles.generateText}>Generate Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#8b5cf630',
    borderRadius: 16,
    gap: 12,
  },
  header: { gap: 3 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { fontSize: 11, fontWeight: '800', color: '#8b5cf6', letterSpacing: 1.5 },
  hint: { fontSize: 12, color: Colors.textMuted, marginLeft: 25 },

  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8b5cf610',
    borderWidth: 1,
    borderColor: '#8b5cf630',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  code: {
    fontSize: 26,
    fontWeight: '900',
    color: '#8b5cf6',
    letterSpacing: 6,
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8b5cf640',
    backgroundColor: '#8b5cf610',
  },
  copyBtnDone: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  copyText: { fontSize: 12, fontWeight: '700', color: '#8b5cf6' },
  copyTextDone: { color: '#fff' },

  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  generateText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});
