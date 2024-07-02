
import {
  Image,
  VStack,
} from "default-theme";

import { Dimensions } from "react-native";

type CarouselItemProps = {
  imageURI: string;
};

export function CarouselItem({ imageURI }: CarouselItemProps) {

  const width = Dimensions.get('window').width;
  
  return(
    <VStack bgColor='$grayFour'>
      <Image
        w={width}
        h={width / 1.8}
        resizeMode="cover"
        alt='Carousel image'
        source={{ uri: imageURI }}
      />
    </VStack>
  );
}