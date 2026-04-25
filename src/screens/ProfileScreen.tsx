import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ProfileScreenProps = {
  onShowVehicle: () => void;
};

export function ProfileScreen({ onShowVehicle }: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons color="#315574" name="person-outline" size={82} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Perfil</Text>

          <TextInput
            placeholder="Nome:"
            placeholderTextColor="#111111"
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="RA:"
              placeholderTextColor="#111111"
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              placeholder="FATEC:"
              placeholderTextColor="#111111"
              style={[styles.input, styles.halfInput]}
            />
          </View>

          <TextInput
            keyboardType="email-address"
            placeholder="Email:"
            placeholderTextColor="#111111"
            style={styles.input}
          />
        </View>

        <Pressable onPress={onShowVehicle} style={styles.vehicleButton}>
          <Text style={styles.vehicleButtonText}>Veiculo</Text>
        </Pressable>
      </View>

      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, styles.navItemWithDivider]}>
          <Ionicons color="#222222" name="home-outline" size={32} />
        </Pressable>
        <Pressable
          onPress={onShowVehicle}
          style={[styles.navItem, styles.navItemWithDivider]}
        >
          <MaterialCommunityIcons color="#222222" name="car-side" size={33} />
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons color="#f1282d" name="person-outline" size={33} />
        </Pressable>
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
    paddingHorizontal: 18,
    paddingTop: 41,
  },
  avatar: {
    width: 103,
    height: 103,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
    borderRadius: 52,
    backgroundColor: '#6dace0',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    minHeight: 420,
    borderRadius: 12,
    backgroundColor: '#d9d9d9',
    paddingHorizontal: 20,
    paddingTop: 46,
    paddingBottom: 25,
  },
  title: {
    marginBottom: 27,
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 13,
    color: '#111111',
    fontSize: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  halfInput: {
    flex: 1,
  },
  vehicleButton: {
    width: '100%',
    maxWidth: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f1282d',
  },
  vehicleButtonText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  bottomNav: {
    height: 42,
    flexDirection: 'row',
    backgroundColor: '#d9d9d9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemWithDivider: {
    borderRightWidth: 1,
    borderRightColor: '#777777',
  },
});
