import { useEffect } from "react";

import { 
  Box, 
  Text,
  Image,
  VStack,
  Pressable,
} from "default-theme";

import { Badge } from "./bagde";
import { UserAvatar } from "./user-avatar";

import { ProductDTO } from "@dtos/ProductDTO";

import { api } from "@services/api";

type ProductItemListProps = {
  product: ProductDTO;
  openProduct: () => void;
  userImage?: string;
};

export function ProductItemList({ product, openProduct, userImage = '' } : ProductItemListProps) {

  const isProductUser: boolean = userImage !== '';

  const productThumb = product.product_images![0].path;

  useEffect(() => {
    if( typeof product.price === 'string') {
      product.price = parseFloat(product.price);
    }
  }, []);

  return(
    <Pressable w='50%' p='$2' pb='$6' flexDirection='column' alignItems='center' onPress={openProduct}>
      <VStack>
        { isProductUser &&
          <Box zIndex={2} position='absolute' w='$8' h='$8' top={8} left={8}>
            <UserAvatar
              sizeMajor={32}
              sizeMinor={28}
              imageUser={`${api.defaults.baseURL}/images/${userImage}`}
            />
          </Box>
        }

        <Box zIndex={2} position='absolute' w='$12' h='$8' top={10} right={6}>
          <Badge 
            labelColor="$graySeven"
            label={product.is_new ? 'NOVO' : "USADO"}
            backgroundColor={product.is_new ? "$blue" : "$grayTwo"}
          />
        </Box>

        { !product.is_active &&
          <Box 
            p='$3'
            h={100} 
            w='$full' 
            zIndex={3}
            overflow="hidden"
            borderRadius='$xl'
            position='absolute'
            bgColor='rgba(0, 0, 0, 0.3)' 
            flexDirection="column-reverse"
          >
            <Text fontFamily='$heading' fontSize='$xs' color='$graySeven' textTransform="uppercase">Anúncio desativado</Text>
          </Box>
        }

        <Box w='$full' borderRadius='$xl' h={100} overflow="hidden">
          <Image
            w='$48'
            h='$32'
            resizeMode='cover'
            alt="Imagem do produto"
            source={{ uri: `${api.defaults.baseURL}/images/${productThumb}`}}
          />
        </Box>

        <Text mt='$2' fontFamily='$body' fontSize='$sm' color={product.is_active ? '$grayTwo' : '$grayFour'}>
          { product.name }
        </Text>

        <Text fontFamily='$heading' fontSize='$md' color={product.is_active ? '$grayOne' : '$grayFour'}>
          <Text fontFamily='$heading' fontSize='$xs' color={product.is_active ? '$grayOne' : '$grayFour'}>R$ </Text> 
          { product.price.toFixed(2).replace('.', ',') }
        </Text>
      </VStack>
    </Pressable>
  );
}