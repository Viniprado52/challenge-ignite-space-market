import { 
  useState,
  useCallback,
} from "react";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Box,
  Text,
  HStack,
  VStack,
  useToast,
  Pressable,
} from "default-theme";

import { Loading } from "./loading";
import { config } from "default-theme/gluestack-ui.config";

import { Tag, ArrowRight } from "phosphor-react-native";

import { api } from "@services/api";

import { ProductDTO } from "@dtos/ProductDTO";
import { AppError } from "@utils/app-error";

export function AdvertisementsCard() {

  const toast = useToast();
  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const colors = config.tokens.colors;
  const [isLoading, setIsLoading] = useState(true);
  const [activeNumberAds, setActiveNumberAds] = useState(0);

  function goToMyAds() {
    navigator.navigate('myAdvertisements');
  }

  async function loadCardData() {
    try {
      setIsLoading(true);
      const response = await api.get('/users/products');
      let productListFiltered: Array<ProductDTO> = [];

      productListFiltered = response.data.filter((item: ProductDTO) => item.is_active);
      setActiveNumberAds(productListFiltered.length);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os seus anúncios ativos.';

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>{title}</Text>
            </Box>
          </Box>
        )
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadCardData();
    },[])
  );

  return(
    <Pressable w='$full' backgroundColor='rgba(100, 122, 199, 0.2)' borderRadius='$md' mt='$3' onPress={goToMyAds}>
      { isLoading ? <Loading /> :
        <HStack p='$5' alignItems='center'>
          <Tag size={22} color={colors.blue} />

          <VStack ml='$4' flex={1}>
            <Text fontFamily='$heading' fontSize='$xl' color='$grayTwo'>{ activeNumberAds }</Text>
            {
              activeNumberAds === 1 ?
              <Text fontFamily='$body' fontSize='$xs' color='$grayTwo'>anúncio ativo</Text>
              :
              <Text fontFamily='$body' fontSize='$xs' color='$grayTwo'>anúncios ativos</Text>
            }
          </VStack>

          <HStack mr='$1'>
            <Text fontFamily='$heading' fontSize='$xs' color='$blue' mr='$2'>Meus anúncios</Text>
            <ArrowRight size={16} color={colors.blue}/>
          </HStack>
        </HStack>
      }
    </Pressable>
    
  );
}