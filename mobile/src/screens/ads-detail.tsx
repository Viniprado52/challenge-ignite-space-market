import { 
  useRef,
  useState,
  useCallback,
} from "react";

import { useAuth } from "@hooks/useAuth";

import { Dimensions, Linking } from "react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { WhatsappLogo } from 'phosphor-react-native';

import { 
  Box,
  Text,
  HStack,
  VStack,
  useToast,
  ScrollView,
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

import { ProductDTO } from "@dtos/ProductDTO";


type RouteParam = {
  idProduct: string;
};

type ProductDTOModified = ProductDTO & {
  price: string;
};

export function AdsDetail() {

  const toast = useToast();
  const route = useRoute();
  const { user } = useAuth();

  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const { idProduct } = route.params as RouteParam;

  const [currentImage, setCurrentImage] = useState(0);
  const [productDetail, setProductDetail] = useState<ProductDTOModified>({} as ProductDTOModified);

  const colors = config.tokens.colors;
  const width = Dimensions.get('window').width;
  const carouselRef = useRef<ICarouselInstance>(null);
  
  function handleGoBackRoute() {
    navigator.navigate('home');
  }

  function handleContactSeller(){
    Linking.openURL(`whatsapp://send?text=Olá, me chamo ${user.name} e tenho interesse no seu anúncio: ${productDetail.name}!&phone=+55${productDetail.user?.tel}`);
  }

  async function loadAdsDetailData() {
    try {
      const response = await api.get(`/products/${idProduct}`);
      setProductDetail(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar as informações de produtos.';

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
    }
  }

  useFocusEffect(useCallback(() => {
    setCurrentImage(0);
    carouselRef.current?.scrollTo({ index: 0 });
    loadAdsDetailData();
  },[idProduct]));

  return(
    <VStack flex={1}>
      <Box mt='$12' px='$6'>
        <Header backAction={handleGoBackRoute} />
      </Box>

      <VStack mt='$3' w={width} h={width / 1.8}>
        <Carousel
          loop={false}
          width={width}
          ref={carouselRef}
          height={width / 1.8}
          scrollAnimationDuration={500}
          data={productDetail.product_images!}
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
          listImage={productDetail.product_images!}
        />
      </VStack>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack px='$5' py='$5'>
          <HStack alignItems='center'>
            <UserAvatar
              sizeMajor={32}
              sizeMinor={28}
              imageUser={`${api.defaults.baseURL}/images/${productDetail.user?.avatar}`}
            />
            <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayOne'>{productDetail.user?.name}</Text>
          </HStack>

          <Box w={53} pt='$6'>
            {
              productDetail.is_new ?
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
            <Text fontFamily='$heading' fontSize='$xl' color='$grayOne'>{ productDetail.name }</Text>
            <Text fontFamily='$heading' fontSize='$xl' color='$blueLight'>
              <Text fontFamily='$heading' fontSize='$sm' color='$blueLight'>R$ </Text> 
              { parseInt(productDetail.price).toFixed(2).replace('.', ',') }
            </Text>
          </HStack>

          <Text textAlign='left' mt='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>
            { productDetail.description }
          </Text>

          <HStack mt='$5'>
            <Text fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
              Aceita troca?
            </Text>
            { productDetail.accept_trade ?
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
              productDetail?.payment_methods && productDetail.payment_methods.map((item, index) => 
                <PaymentTypeIcons
                  paymentType={item.key}
                  key={index + 'detdetail'}
                />
              )
            }
          </VStack>
        </VStack>
      </ScrollView>

      <HStack
        pb='$3'
        px='$8'
        h='$24'
        w='$full'
        alignItems='center'
        bgColor='$graySeven'
        justifyContent='space-between'
      >
        <Text fontFamily='$heading' fontSize='$2xl' color='$blue'>
          <Text fontFamily='$heading' fontSize='$sm' color='$blue'>R$ </Text> 
          { parseInt(productDetail.price).toFixed(2).replace('.', ',') }
        </Text>
          
        <Box w='$48'>
          <FullButton 
            bgColor="$blueLight"
            labelColor="$graySeven"
            label="Entrar em contato"
            onPress={handleContactSeller}
            icon= {
              <WhatsappLogo size={16} weight="fill" color={colors.graySeven}/>
            }
          />
        </Box>
      </HStack>
    </VStack>
  );
}