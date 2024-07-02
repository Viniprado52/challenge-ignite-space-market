
import { 
  useState,
  ReactNode,
} from 'react';

import { TextInputProps } from 'react-native';

import { 
  Text,
  Input,
  InputSlot,
  InputField,
} from "default-theme";

import { Eye, EyeSlash } from 'phosphor-react-native';

import { config } from 'default-theme/gluestack-ui.config';

type SimpleInputProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
  children?: ReactNode;
  isCash?: boolean;
};

export function SimpleInput({ label, isCash = false,  children = undefined, isPassword = false, ...rest } : SimpleInputProps) {

  const [showPassword, setShowPassword] = useState(false);

  const { colors } = config.tokens;
  
  function handleTooglePassword() {
    setShowPassword(!showPassword);
  }

  return(
    <Input
      mt='$4'
      h='$12'
      w='$full'
      borderWidth={0}
      borderRadius='$md'
      bgColor='$graySeven'
    >
      { isCash &&
        <InputSlot w='$10' pl='$3'>
          <Text fontFamily='$body' fontSize='$md' color='$grayOne'>R$ </Text>
        </InputSlot>
      }
      <InputField 
        color='$grayOne'
        fontFamily="$body"
        placeholder={label}
        placeholderTextColor='#9F9BA1'
        type={showPassword || !isPassword ? 'text' : 'password'} 
        { ...rest }
      />
      { isPassword &&
        <InputSlot w='$10' mr='$2' onPress={handleTooglePassword}>
          { showPassword ? 
            <Eye color={colors.grayThree} size={20} /> 
            : 
            <EyeSlash color={colors.grayThree} size={20} /> 
          }
        </InputSlot>
      }
      { children }
    </Input>
  );
}