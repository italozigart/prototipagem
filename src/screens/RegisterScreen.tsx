import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  // Estados para guardar o que o usuário digitar
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');
  const [unidade, setUnidade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRegister = () => {
    console.log('Simulando Cadastro...', { nome, email, ra, unidade });
    // Aqui entrará a lógica de salvar no banco de dados futuramente
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ScrollView permite rolar a tela se o teclado cobrir algum campo */}
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Botão Voltar (igual à imagem) */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>voltar</Text>
          </TouchableOpacity>

          {/* Card cinza do Formulário */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Nome:"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Email:"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="RA:"
              placeholderTextColor="#888"
              keyboardType="numeric" // Abre o teclado numérico
              value={ra}
              onChangeText={setRa}
            />

            <TextInput
              style={styles.input}
              placeholder="Unidade FATEC:"
              placeholderTextColor="#888"
              value={unidade}
              onChangeText={setUnidade}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha:"
              placeholderTextColor="#888"
              secureTextEntry // Esconde a senha
              value={senha}
              onChangeText={setSenha}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha:"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            {/* Botão Cadastrar */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.85}>
              <Text style={styles.registerButtonText}>CADASTRAR</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    // O align items 'center' não é usado aqui para o card poder ocupar 100% da largura mais facilmente
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#D9D9D9', // Fundo cinza claro
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
  card: {
    width: '100%',
    backgroundColor: '#D9D9D9', // Fundo cinza do card
    borderRadius: 12,
    padding: 20,
    gap: 15, // Espaçamento automático entre os campos
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#D32F2F', // Vermelho
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10, // Dá um espacinho extra antes do botão
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});