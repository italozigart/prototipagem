import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Substitua pelo seu ícone de carro ou importe de uma lib como @expo/vector-icons
// import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onBack?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  onLogin?: (email: string, password: string) => void;
}

export default function LoginScreen({
  onBack,
  onForgotPassword,
  onRegister,
  onLogin,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    onLogin?.(email, password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Ícone do carro */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            {/* Troque pelo componente de ícone da sua lib */}
            <Text style={styles.iconEmoji}>🚗</Text>
          </View>
        </View>

        {/* Botão Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {/* Card do formulário */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email:"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha:"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Esqueci a senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRegister} activeOpacity={0.7}>
            <Text style={styles.registerText}>
              Não possui conta?{' '}
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  // Ícone
  iconWrapper: {
    marginBottom: 12,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 40,
  },

  // Botão voltar
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },

  // Card
  card: {
    width: '100%',
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },

  // Inputs
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    borderWidth: 0,
  },

  // Esqueci a senha
  forgotText: {
    fontSize: 13,
    color: '#444',
    marginTop: -4,
    marginBottom: 4,
  },

  // Botão entrar
  loginButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
  },

  // Cadastre-se
  registerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  registerLink: {
    color: '#D32F2F',
    fontWeight: '600',
  },
});
