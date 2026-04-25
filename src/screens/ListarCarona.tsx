import { RootStackParamList } from '@/app/index';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NavProp = StackNavigationProp<RootStackParamList>;
export default function ListarCarona() {
  const router = useRouter();

  const buttonStyle = {
    backgroundColor: '#E52929',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  };

  return (

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View >
          <View>
            <Image
              source={require('@/src/assets/images/Logo.png')}
              style={styles.LogoImage}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.menuIcon}>
          <MaterialCommunityIcons name="menu" size={24} color="#444D5A" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Lista de Caronas:</Text>

      {/* Scroll Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Button 1 - Oferecer Viagem */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E52929' }]}
          onPress={() => router.push('/')}
        >
          <MaterialCommunityIcons name="car" style={styles.icon} size={24} color="white" />
          <Text style={styles.buttonText}>Oferecer{'\n'}Viagem</Text>
        </TouchableOpacity>

        {/* Button 2 - Solicitar Carona */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E52929' }]}
          onPress={() => router.push("/")}
        >
          <FontAwesome5 name="hand-holding"  style={styles.icon} size={24} color="white" />
          <Text style={styles.buttonText}>Solicitar{'\n'}Carona</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <AntDesign name="home" size={24} color="#444D5A" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#E52929" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <FontAwesome5 name="user" size={24} color="#444D5A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  LogoImage: {
    margin: 'auto',
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  subLogoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  menuIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 24,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#E52929',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    position: 'absolute',
    left: '15%',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  buttonText: {
  color: 'white',
  fontSize: 16,
  marginLeft: 16,
  fontWeight: '600',
  textAlign: 'center',
},
  bottomNav: {
  flexDirection: 'row',
  backgroundColor: '#EBEBEB',
  borderTopWidth: 1,
  borderTopColor: '#ddd',
  height: 60,
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingBottom: 8,
},
  navItem: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
  navDivider: {
  width: 1,
  height: 30,
  backgroundColor: '#CCC',
},
});
