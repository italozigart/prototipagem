import { RootStackParamList } from "@/app/index";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type NavProp = StackNavigationProp<RootStackParamList>;
export default function ListarCarona() {
  const navigation = useNavigation<NavProp>();

  return (

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View >
          <View>
            <Image
              source={require('@/src/assets/images/Logoh.png')}
              style={styles.LogoImage}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.menuIcon}>
          <MaterialCommunityIcons name="menu" size={24} color="#444D5A" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}> Lista de Caronas</Text>

      {/* Scroll Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Button 1 - Oferecer Viagem */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E52929' }]}
          onPress={() => navigation.navigate('OferecerViagem')}
        >
          <MaterialCommunityIcons name="car" style={styles.icon} size={24} color="white" />
          <Text style={styles.buttonText}>Oferecer{'\n'}Viagem</Text>
        </TouchableOpacity>

        {/* Button 2 - Solicitar Carona */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E52929' }]}

        >
          <FontAwesome5 name="hand-holding" style={styles.icon} size={24} color="white" />
          <Text style={styles.buttonText}>Solicitar{'\n'}Carona</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <AntDesign name="home" size={24} color="#444D5A" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#E52929" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="user" size={24} color="#444D5A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  LogoImage: {
    margin: 'auto',
    width: 200,
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
  menuIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
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
    fontSize: 30,
    right: '26%',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    right: 5,
    fontWeight: '600',
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
