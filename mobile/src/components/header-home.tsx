import { useAuth } from "@hooks/useAuth";

import { 
  Box,
  Text,
  VStack,
  HStack,
} from "default-theme";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Plus } from "phosphor-react-native";

import { UserAvatar } from "./user-avatar";
import { FullButton } from "@components/full-button";
import { useNavigation } from "@react-navigation/native";

import { api } from "@services/api";
import { config } from "default-theme/gluestack-ui.config";

export function HeaderHome() {

  const { user } = useAuth();

  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const { colors } = config.tokens;
  
  function handleGoCreateAds(){
    navigator.navigate('advertisementsCreate', { callBackRoute: 'home' });
  }

  return(
    <HStack mt='$16' pt='$3' alignItems='center'>
      <UserAvatar
        sizeMajor={48}
        sizeMinor={44}
        imageUser={`${api.defaults.baseURL}/images/${user.avatar}`}
      />

      <VStack ml='$3' flex={1}>
        <Text fontFamily='$body' fontSize='$md' color='$grayOne'>Boas vindas,</Text>
        <Text fontFamily='$heading' fontSize='$md' color='$grayOne'>{user.name.split(' ')[0]}!</Text>
      </VStack>

      <Box w='$40'>
        <FullButton
          bgColor='$grayOne'
          label='Criar anúncio'
          labelColor='$graySeven'
          onPress={handleGoCreateAds}
          icon={
            <Plus size={16} color={colors.white} />
          }
        />
      </Box>
    </HStack>
  );
}