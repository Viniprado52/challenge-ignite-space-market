import { StatusBar } from "react-native";

import { GluestackUIProvider } from "default-theme";

import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from '@expo-google-fonts/karla';

import { PublicRoutes } from "@routes/index";
import { Loading } from "@components/loading";
import { AuthContextProvider } from "@contexts/AuthContext";
import { PrductContextProvider, ProductContext } from "@contexts/ProductContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold
  });

  return (
    <GluestackUIProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        <PrductContextProvider>
          { fontsLoaded ? <PublicRoutes /> : <Loading /> }
        </PrductContextProvider>
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
