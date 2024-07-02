import { 
  Box,
  Text,
  Center,
  HStack,
  VStack,
} from "default-theme";

import { useAuth } from "@hooks/useAuth";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { FullButton } from "@components/full-button";

import IconMarketSpace from '@assets/icon-space-market.svg';

export function SignOut() { 

  const { signOut } = useAuth();
  const navigator = useNavigation<AppNavigatorRoutesProps>();

  function goBackHome() {
    navigator.navigate('home');
  }

  return (
    <Center px='$8' flex={1} bgColor="$graySix">
      <VStack p='$5' bgColor="$graySeven" alignItems='center' borderRadius='$md'>
        <IconMarketSpace width={95.35} height={64} />

        <Text fontFamily="$heading" fontSize='$xl' textAlign='center' color='$grayOne' mt='$5'>
          Deseja realmente sair da aplicação?
        </Text>

        <Text fontFamily="$body" fontSize='$sm' color='$grayTwo' textAlign="center" mt='$3'>
          Você será redirecionado a tela de login
        </Text>

        <HStack mt='$8' pb='$3'>
          <Box flex={1}>
            <FullButton
              bgColor="$grayFour"
              label="Cancelar"
              labelColor="$grayOne"
              onPress={goBackHome}
            />
          </Box>
          <Box w='$3' h='$2'></Box>
          <Box flex={1}>
            <FullButton
              bgColor="$grayOne"
              label="Sair"
              labelColor="$graySeven"
              onPress={signOut}
            />
          </Box>
        </HStack>
      </VStack>
    </Center>
  );
}