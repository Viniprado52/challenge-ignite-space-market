import { 
  Box, 
  Image
} from "default-theme";

type UserAvatarProps = {
  imageUser: string;
  sizeMajor: number;
  sizeMinor: number;
};

export function UserAvatar({ imageUser, sizeMajor, sizeMinor } : UserAvatarProps) {
  return(
    <Box 
      w={sizeMajor} 
      h={sizeMajor}
      alignItems='center'
      borderRadius='$full' 
      bgColor='$blueLight' 
      justifyContent='center'
    >
      <Box 
        w={sizeMinor} 
        h={sizeMinor}
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        borderRadius='$full' bgColor="$grayFive" 
      >
        <Image
          w={sizeMinor}
          h={sizeMinor}
          resizeMode="cover"
          alt='Imagem do usuario'
          source={{ uri: imageUser }}
        />
      </Box>
    </Box>
  );
}