import { 
  Box,
  Image,
  Center,
  Pressable,
} from "default-theme";

import { X as CloseIcon } from "phosphor-react-native";

import { config } from "default-theme/gluestack-ui.config";

type ImageItemProductProps = {
  image: string;
  onRemove: () => void;
};

export function ImageItemProduct({ image, onRemove }: ImageItemProductProps) {

  const { colors } = config.tokens;

  return(
    <Box mr='$3' w='$24' h='$24' bgColor="$grayFour" borderRadius='$md' overflow='hidden'>
      <Pressable
        w='$5' 
        h='$5'
        top={3}
        right={3}
        zIndex={2}
        onPress={onRemove}
        bgColor='$grayTwo'
        position='absolute'
        borderRadius='$full'
      >
        <Center flex={1}>
          <CloseIcon size={12} color={colors.white} />
        </Center>
      </Pressable>
      
      <Image
        w='$24' 
        h='$24'
        resizeMode="cover"
        alt='Imagem do Produto'
        source={{ uri: image }}
      />
    </Box>
  );
}