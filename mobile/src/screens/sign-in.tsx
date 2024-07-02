import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useAuth } from "@hooks/useAuth";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { 
  Box, 
  Text, 
  VStack, 
  useToast
} from "default-theme";

import { FullButton } from "@components/full-button";
import { SimpleInput } from "@components/simple-input";

import TextMarketSpace from '@assets/text-marketspace.svg';
import IconMarketSpace from '@assets/icon-space-market.svg';

import { AppError } from "@utils/app-error";

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {

  const toast = useToast();
  const { singIn } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  function handleGoSignUp() {
    navigator.navigate('signup');
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await singIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;
 
      const title =  isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
    
      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5' mt='$8'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>{ title }</Text>
            </Box>
          </Box>
        )
      });
      setIsLoading(false);
    }
  }

  return(
    <Box flex={1} bgColor="$graySeven">
      <VStack
        px='$10'
        height='73%'
        bgColor="$graySix"
        alignItems="center"
        justifyContent="center"
        borderBottomLeftRadius='$3xl'
        borderBottomRightRadius='$3xl'
      >
        <IconMarketSpace width={95.35} height={64} />
        
        <Box mt='$5'>
          <TextMarketSpace width={193} height={28.49} />
        </Box>

        <Text fontFamily="$body" fontSize='$sm' color='$grayThree' mt='$1'>
          Seu espaço de compra e venda
        </Text>

        <Text fontFamily="$body" fontSize='$sm' color='$grayTwo' mt='$20'>
          Acesse sua conta 
        </Text>

        <Controller 
          control={control}
          name="email"
          rules={{ required: 'Informe o e-mail' }}
          render={({ field: { onChange } }) => (
            <SimpleInput 
              label="Entrar" 
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address" 
              onChangeText={onChange}
            />
          )}
        />
        { errors.email && 
          <Text mt='$2' w='$full' fontFamily='$body' fontSize='$sm' color='$redLight'>
            {errors.email.message}
          </Text>
        }

        <Controller 
          control={control}
          name="password"
          rules={{ required: 'Informe a senha' }}
          render={({ field: { onChange } }) => (
            <SimpleInput 
              label="Senha" 
              isPassword
              onChangeText={onChange}
            />
          )}
        />
        { errors.password &&
          <Text mt='$2' w='$full' fontFamily='$body' fontSize='$sm' color='$redLight'>
            {errors.password.message}
          </Text>
        }
        
        <Box mt='$8' w='$full'>
          <FullButton 
            label="Entrar" 
            bgColor="$blueLight"
            isLoading={isLoading}
            labelColor="$graySeven" 
            onPress={handleSubmit(handleSignIn)}
          />
        </Box>
      </VStack>

      <VStack height='28%' justifyContent="center" bgColor="$graySeven" alignItems="center" px='$10'>
        <Text fontFamily='$body' fontSize='$sm' color='$grayTwo'>Ainda não tem acesso?</Text>
        <Box mt='$4' w='$full'>
          <FullButton label="Criar uma conta" labelColor="$grayTwo" bgColor="$grayFive" onPress={handleGoSignUp}/>
        </Box>
      </VStack>
    </Box>
  );
}