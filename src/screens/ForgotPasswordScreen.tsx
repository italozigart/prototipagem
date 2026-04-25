import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    if (!code || code.length < 5) {
      Alert.alert('Atenção', 'Insira o código enviado ao seu e-mail.');
      return;
    }
    // router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🚗</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>voltar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insira o codigo{'\n'}enviado ao seu email</Text>

          <TextInput
            style={styles.input}
            placeholder="- - - - -"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={5}
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  iconWrapper: { marginBottom: 12 },
  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#D9D9D9', alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 40 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#E0E0E0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4, marginBottom: 16 },
  backText: { fontSize: 14, color: '#222', fontWeight: '500' },
  card: { width: '100%', backgroundColor: '#EBEBEB', borderRadius: 12, padding: 20, gap: 12 },
  cardTitle: { fontSize: 15, color: '#222', fontWeight: '500', textAlign: 'center', marginBottom: 4 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 20, color: '#222', textAlign: 'center', letterSpacing: 8 },
  confirmButton: { backgroundColor: '#D32F2F', borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  confirmButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, letterSpacing: 1.5 },
});