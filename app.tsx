import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./app/index";

export default function App() {
    return (
        <NavigationContainer >
            <RootStack />
        </NavigationContainer >
    );
}