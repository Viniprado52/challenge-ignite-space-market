import { PressableProps } from "react-native";

import { 
  Text,
  Center,
  HStack,
  Pressable,
} from "default-theme";

import { X as CrossIcon } from "phosphor-react-native";

import { config } from "default-theme/gluestack-ui.config";

type ButtonOptionProps = PressableProps & {
  label: string;
  isActive: boolean;
};

export function ButtonOption({ label, isActive,  ...rest } : ButtonOptionProps) {

  const { colors } = config.tokens;
  
  return(
    <Pressable 
      w='$20' 
      px='$2' 
      mr='$3'
      py='$2.5'
      alignItems='center'
      borderRadius='$full'
      justifyContent='center'
      bgColor={ isActive ? '$blueLight' : '$grayFive' }
      {...rest}
    >
      <HStack alignItems='center'>
        <Text fontFamily='$heading' fontSize='$xs' color={ isActive ? '$graySeven' : '$grayThree' }>
          { label }
        </Text>

        {
          isActive &&
          <Center w='$3.5' h='$3.5' ml='$1' borderRadius='$full' bgColor='$graySeven'>
            <CrossIcon size={8} weight='bold' color={colors.blueLight}/>
          </Center>
        }
      </HStack>
    </Pressable>
  );
}