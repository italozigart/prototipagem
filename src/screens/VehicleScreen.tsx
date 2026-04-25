import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type VehicleScreenProps = {
  onBack: () => void;
};

const fields = ['Modelo', 'Marca', 'Cor', 'Ano', 'Placa'] as const;

type Field = (typeof fields)[number];

const initialForm: Record<Field, string> = {
  Modelo: '',
  Marca: '',
  Cor: '',
  Ano: '',
  Placa: '',
};

export function VehicleScreen({ onBack }: VehicleScreenProps) {
  const [form, setForm] = useState(initialForm);

  const isComplete = useMemo(
    () => fields.every((field) => form[field].trim() !== ''),
    [form],
  );

  function handleChange(field: Field, value: string) {
    let nextValue = value;

    if (field === 'Ano') {
      nextValue = value.replace(/\D/g, '');
    }

    if (field === 'Placa') {
      nextValue = value.toUpperCase();
    }

    setForm((currentForm) => ({
      ...currentForm,
      [field]: nextValue,
    }));
  }

  function handleSave() {
    if (!isComplete) {
      return;
    }

    Alert.alert('Sucesso', 'Veiculo salvo com sucesso!');
    setForm(initialForm);
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>voltar</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.title}>Veiculo</Text>

          {fields.map((field) => (
            <TextInput
              key={field}
              keyboardType={field === 'Ano' ? 'number-pad' : 'default'}
              maxLength={field === 'Ano' ? 4 : undefined}
              onChangeText={(value) => handleChange(field, value)}
              placeholder={`${field}:`}
              placeholderTextColor="#8d8d8d"
              style={styles.input}
              value={form[field]}
            />
          ))}

          <Pressable
            disabled={!isComplete}
            onPress={handleSave}
            style={[styles.saveButton, !isComplete && styles.disabledButton]}
          >
            <Text style={styles.saveText}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 21,
    paddingVertical: 22,
  },
  backButton: {
    alignSelf: 'center',
    marginRight: 300,
    marginBottom: 16,
    backgroundColor: '#dddddd',
    paddingHorizontal: 6,
    paddingTop: 5,
    paddingBottom: 4,
  },
  backText: {
    color: '#000000',
    fontSize: 25,
    lineHeight: 28,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    minHeight: 640,
    borderRadius: 12,
    backgroundColor: '#d9d9d9',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  title: {
    marginBottom: 34,
    color: '#000000',
    fontSize: 25,
    fontWeight: '400',
    lineHeight: 29,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 51,
    marginBottom: 34,
    borderRadius: 12,
    backgroundColor: '#fffbff',
    paddingHorizontal: 13,
    color: '#111111',
    fontSize: 22,
  },
  saveButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 21,
    borderRadius: 12,
    backgroundColor: '#f1282d',
  },
  disabledButton: {
    opacity: 0.55,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
});
