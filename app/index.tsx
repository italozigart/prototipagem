import ListarCarona from "@/src/screens/ListarCarona";
import OferecerViagem from "@/src/screens/OferecerViagem";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  //Lista de telas a serem navegadas
  ListarCarona: undefined;
  OferecerViagem: undefined;
 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
    initialRouteName="ListarCarona"
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListarCarona" component={ListarCarona} />
      <Stack.Screen name="OferecerViagem" component={OferecerViagem} />
    </Stack.Navigator>
  );
}