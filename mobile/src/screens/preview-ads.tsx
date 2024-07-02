import { 
  useRef,
  useState,
  useCallback,
} from "react";

import { Dimensions } from "react-native";

import { useAuth } from "@hooks/useAuth";
import { useProduct } from "@hooks/useProduct";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { ArrowLeft, Tag } from 'phosphor-react-native';

import { 
  Box,
  Text,
  HStack,
  VStack,
  ScrollView,
  useToast,
} from "default-theme";

import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { config } from "default-theme/gluestack-ui.config";

import { Badge } from "@components/bagde";
import { Paginator } from "@components/paginator";
import { FullButton } from "@components/full-button";
import { UserAvatar } from "@components/user-avatar";
import { CarouselItem } from "@components/carousel-item";
import { PaymentTypeIcons } from "@components/payment-type-icons";

import { api } from "@services/api";

import { AppError } from "@utils/app-error";

type RouteParam = {
  callBackRoute: string;
};

export function PreviewAds() {

  const toast = useToast();
  const route = useRoute();
  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();

  const { 
    product,
    productImages,
    productImagesEditAdded,
    productImagesEditDelete,
  } = useProduct();

  const { callBackRoute } = route.params as RouteParam;

  const [isLoading, setIsLoading] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const width = Dimensions.get('window').width;
  const colors = config.tokens.colors;
  
  function handleGoBackRoute() {
    if (callBackRoute === 'advertisementsEdit' ) {
      navigator.navigate('advertisementsEdit');
    } else {
      navigator.navigate('advertisementsCreate', { callBackRoute: 'advertisementsView'});
    }
  }

  async function handleEditProduct() {
    try {
      setIsLoading(true);

      const paramsUpdate = {
        name: product.name,
        price: product.price,
        is_new: product.is_new,
        description: product.description,
        accept_trade: product.accept_trade,
        payment_methods: product.payment_methods
      }
      
      await api.put(`/products/${product.id}`, paramsUpdate);

      if (productImagesEditDelete.length > 0){
        await updateImagesProducts();
      }

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$green700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Produto alterado com sucesso!</Text>
            </Box>
          </Box>
        )
      });

      navigator.navigate('myAdvertisements');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível alterar o produto.';

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

  async function updateImagesProducts() {
    try {
      await api.delete('/products/images', { data: { productImagesIds: productImagesEditDelete } });

      const requestBodyImages = new FormData();

      requestBodyImages.append('product_id', product.id);

      productImagesEditAdded.forEach((item, index) => {
        const fileExtension = item.split('.').pop();

        const photoFile = {
          name: `${product.name + index}.${fileExtension}`.toLowerCase(),
          uri: item,
          type: `image/${fileExtension}`
        } as any;

        requestBodyImages.append('images', photoFile);
      });
      
      await api.post('/products/images', requestBodyImages, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async function handleCreateProduct() {
    try {
      setIsLoading(true);

      const newProduct = {
        name: product.name,
        is_new: product.is_new,
        description: product.description,
        accept_trade: product.accept_trade,
        price: parseInt(String(product.price)),
        payment_methods: product.payment_methods
      };
      
      const { data } = await api.post('/products', newProduct);

      // Cadastrando as imagens do produto
      const requestBodyImages = new FormData();

      requestBodyImages.append('product_id', data.id);

      productImages.forEach((item, index) => {
        const fileExtension = item.path.split('.').pop();

        const photoFile = {
          name: `${product.name + index}.${fileExtension}`.toLowerCase(),
          uri: item.path,
          type: `image/${fileExtension}`
        } as any;

        requestBodyImages.append('images', photoFile);
      });
      
      await api.post('/products/images', requestBodyImages, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$green700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Produto cadastrado com sucesso!</Text>
            </Box>
          </Box>
        )
      });

      navigator.navigate('home');
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

  useFocusEffect(useCallback(() => {
    setCurrentImage(0);
    carouselRef.current?.scrollTo({ index: 0 });
  },[]));

  return(
    <VStack flex={1}>
      <Box pb='$5' bgColor='$blueLight' h='$32' justifyContent='flex-end' alignItems='center'>
        <Text fontFamily='$heading' fontSize='$md' color='$graySeven'>
          Pré visualização do anúncio
        </Text>
        <Text mt='$1' fontFamily='$body' fontSize='$sm' color='$graySeven'>
          É assim que seu produto vai aparecer!
        </Text>
      </Box>

      <VStack w={width} h={width / 1.8}>
        <Carousel
          loop={false}
          width={width}
          ref={carouselRef}
          height={width / 1.8}
          data={productImages}
          scrollAnimationDuration={500}
          onSnapToItem={(index) => setCurrentImage(index)}
          renderItem={({ item, index }) => (
            <CarouselItem
              key={index}
              imageURI={ callBackRoute === 'advertisementsCreate' || !item.id ? item.path : `${api.defaults.baseURL}/images/${item.path}`}
            />
          )}
        />
        <Paginator
          listImage={productImages}
          currentImage={currentImage}
        />
      </VStack>
      
      <ScrollView showsVerticalScrollIndicator={false} key={product.id}>
        <VStack px='$5' py='$5'>
          <HStack alignItems='center'>
            <UserAvatar
              sizeMinor={28}
              sizeMajor={32}
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
              product.payment_methods.map((item, index) => 
                <PaymentTypeIcons
                  key={index + 'preview'}
                  paymentType={item} 
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
        <Box flex={1}>
          <FullButton 
            bgColor="$grayFive"
            labelColor="$grayTwo"
            label="Voltar e editar"
            onPress={handleGoBackRoute}
            icon= {
              <ArrowLeft size={16} color={colors.grayTwo}/>
            }
          />
        </Box>
        <Box w='$5' h='$3'></Box>
        <Box flex={1}>
          <FullButton 
            label="Publicar"
            bgColor="$blueLight"
            isLoading={isLoading}
            labelColor="$graySeven"
            onPress={ callBackRoute === 'advertisementsCreate' ? handleCreateProduct : handleEditProduct}
            icon= {
              <Tag size={16} color={colors.graySeven}/>
            }
          />
        </Box>
      </HStack>
    </VStack>
  );
}