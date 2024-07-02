import { Box } from "default-theme";

import { Dimensions, FlatList } from "react-native";

type PaginatorProps = {
  currentImage: number;
  listImage: Array<any>;
};

export function Paginator({ currentImage, listImage } : PaginatorProps) {

  const widthScreen = Dimensions.get('window').width;
  
  return(
    <Box w='$full' mb='$1'>
      <FlatList 
        horizontal
        data={listImage}
        keyExtractor={(item, index) => (item.id ? item.id + index : item + index)}
        renderItem={({ index }) => (
          <Box
            h='$1'
            ml='$3'
            key={index} 
            bgColor='$graySeven'
            borderRadius='$full'
            w={ widthScreen / listImage.length - 18 }
            opacity={currentImage === index ? 0.75 : 0.4}
          ></Box>
        )}
      />
    </Box>
  );
}