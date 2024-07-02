import { ReactNode } from "react";

import { PressableProps } from "react-native";

import {
  Text,
  HStack,
  Button,
  Spinner
} from "default-theme";

type FullButtonProps = PressableProps & {
  label: string;
  bgColor: string;
  labelColor: string;
  icon?: ReactNode;
  isLoading?: boolean;
};

export function FullButton({ label, bgColor, labelColor, icon = undefined, isLoading = false,  ...rest } : FullButtonProps) {

  return(
    <Button 
      w='$full' 
      h='$12' 
      bgColor={bgColor}
      borderRadius='$md'
      isDisabled={isLoading}
      { ...rest }
    >
      <HStack>
        {
          isLoading ? <Spinner color={labelColor} /> :
          <>
            { icon }
            <Text ml='$3' fontFamily='$heading' fontSize='$sm' textAlign="center" color={labelColor}>
              { label }
            </Text>
          </>
        }
      </HStack>
    </Button>
  );
}