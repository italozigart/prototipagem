import { useRouter } from 'expo-router'; // 1. Importamos o useRouter aqui!
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Moldura do Título */}
      <View style={styles.boxTitulo}>
        <Text style={styles.textoFatec}>FATEC</Text>
        <Text style={styles.textoDrive}>DRIVE</Text>
      </View>

      {/* Ícone Central (representado por um círculo) */}
      <View style={styles.circuloIcone}>
        <Text style={styles.textoIcone}>🚗</Text>
      </View>

      {/* Botões */}
      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => router.push('/RegisterScreen')} // <-- AQUI!
      >
        <Text style={styles.textoBotao}>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botao} 
        
        onPress={() => router.push('/login')} 
      >
        <Text style={styles.textoBotao}>LOGIN</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTitulo: {
    borderWidth: 2,
    borderColor: '#CC0000',
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
  textoFatec: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 50,
  },
  textoDrive: {
    fontSize: 40,
    fontWeight: '400',
    color: '#000000',
  },
  circuloIcone: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#CC0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  textoIcone: {
    fontSize: 70,
  },
  botao: {
    backgroundColor: '#CC0000',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});