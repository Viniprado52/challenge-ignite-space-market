import { 
  useRef,
  useState,
  useCallback,
} from "react";

import { Dimensions } from "react-native";

import { useAuth } from "@hooks/useAuth";
import { useProduct } from "@hooks/useProduct";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Power, TrashSimple } from 'phosphor-react-native';

import { 
  Box,
  Text,
  HStack,
  VStack,
  ScrollView,
  Center,
  useToast,
} from "default-theme";

import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { config } from "default-theme/gluestack-ui.config";

import { Badge } from "@components/bagde";
import { Header } from "@components/header";
import { Paginator } from "@components/paginator";
import { FullButton } from "@components/full-button";
import { UserAvatar } from "@components/user-avatar";
import { CarouselItem } from "@components/carousel-item";
import { PaymentTypeIcons } from "@components/payment-type-icons";

import { api } from "@services/api";

import { AppError } from "@utils/app-error";

export function MyAdsDetail(){

  const toast = useToast();
  const { user } = useAuth();
  const { product } = useProduct();

  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const carouselRef = useRef<ICarouselInstance>(null);
  const width = Dimensions.get('window').width;
  const colors = config.tokens.colors;
  
  function handleGoBackRoute() {
    navigator.navigate('myAdvertisements');
  }

  function handleGoEditAd() {
    navigator.navigate('advertisementsEdit');
  }

  async function handleEnableOrDisableAd() {
    try {
      setIsLoading(true);
      const visibility: boolean = !product.is_active;
      await api.patch(`/products/${product.id}`, { is_active: visibility });

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$green700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Visibilidade do produto atualizada com sucesso.</Text>
            </Box>
          </Box>
        )
      });

      navigator.navigate('myAdvertisements');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível cadastrar o produto.';

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

  async function handleDeleteAd() {
    try {
      setIsLoading(true);
      await api.delete(`/products/${product.id}`);

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$green700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Produto removido com sucesso!</Text>
            </Box>
          </Box>
        )
      });

      navigator.navigate('myAdvertisements');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível remover o produto.';

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

  useFocusEffect(useCallback(() => {
    setCurrentImage(0);
    carouselRef.current?.scrollTo({index: 0});
  },[]));

  return(
    <VStack flex={1}>
      <Box mt='$12' px='$6'>
        <Header 
          editAction={handleGoEditAd}
          backAction={handleGoBackRoute}
        />
      </Box>

      <VStack mt='$3' w={width} h={width / 1.8}>
        {
          !product.is_active &&
            <Box
              w={width} 
              zIndex={2}
              h={width / 1.8}
              position='absolute'
              bgColor='rgba(0, 0, 0, 0.5)'
            >
              <Center flex={1}>
                <Text fontFamily='$heading' fontSize='$sm' color='$graySeven' textTransform="uppercase">Anúncio desativado</Text>
              </Center>
            </Box>
        }
        <Carousel
          loop={false}
          width={width}
          ref={carouselRef}
          height={width / 1.8}
          scrollAnimationDuration={500}
          data={product.product_images!}
          onSnapToItem={(index) => setCurrentImage(index)}
          renderItem={({ item, index }) => (
            <CarouselItem
              key={item + index + 'detail'}
              imageURI={`${api.defaults.baseURL}/images/${item.path}`}
            />
          )}
        />
        <Paginator
          currentImage={currentImage}
          listImage={product.product_images!}
        />
      </VStack>
      
      <ScrollView showsVerticalScrollIndicator={false} key={product.id}>
        <VStack px='$5' py='$5'>
          <HStack alignItems='center'>
            <UserAvatar
              sizeMajor={32}
              sizeMinor={28}
              imageUser={`${api.defaults.baseURL}/images/${user.avatar}`}
            />
            <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayOne'>{ user.name }</Text>
          </HStack>

          <Box w={53} pt='$6'>
            {
              product.is_new ?
              <Badge 
                label="NOVO"
                labelColor="$graySeven"
                backgroundColor="$blueLight"
              />
              :
              <Badge 
                label="USADO"
                labelColor="$grayTwo"
                backgroundColor="$grayFive"
              />
            }
          </Box>

          <HStack pt='$3' justifyContent='space-between' alignItems='center'>
            <Text fontFamily='$heading' fontSize='$xl' color='$grayOne'>{ product.name }</Text>
            <Text fontFamily='$heading' fontSize='$xl' color='$blueLight'>
              <Text fontFamily='$heading' fontSize='$sm' color='$blueLight'>R$ </Text> 
              { product.price.toFixed(2).replace('.', ',') }
            </Text>
          </HStack>

          <Text textAlign='left' mt='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>
            { product.description }
          </Text>

          <HStack mt='$5'>
            <Text fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
              Aceita troca?
            </Text>
            { product.accept_trade ?
              <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>
                Sim
              </Text>
              :
              <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>
                Não
              </Text>
            }
          </HStack>

          <Text mt='$5' fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
            Meios de pagamento:
          </Text>

          <VStack mt='$3'>
            {
              product?.payment_methods && product.payment_methods.map((item, index) => 
                <PaymentTypeIcons
                  paymentType={item.key}
                  key={index + 'edtdetail'}
                />
              )
            }
          </VStack>
        </VStack>
      </ScrollView>

      <VStack p='$8'  w='$full'px='$5'>
        <FullButton
          isLoading={isLoading}
          labelColor="$graySeven"
          onPress={handleEnableOrDisableAd}
          bgColor={product.is_active ? "$grayOne" : '$blueLight'}
          label={product.is_active ? "Desativar anúncio" : "Reativar anúncio"}
          icon={
            <Power size={16} color={colors.graySeven}/>
          }
        />
        <Box w='$2' h='$3'></Box>
        <FullButton
          bgColor="$grayFive"
          labelColor="$grayTwo"
          label="Excluir anúncio"
          onPress={handleDeleteAd}
          isLoading={isLoading}
          icon={
            <TrashSimple size={16}/>
          }
        />
      </VStack>
    </VStack>
  );
}