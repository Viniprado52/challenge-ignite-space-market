import { useState } from "react";
import { Platform } from "react-native";

import {
  Box,
  Text,
  Image,
  VStack,
  useToast, 
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from "default-theme";

import { PencilSimpleLine } from 'phosphor-react-native'

import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LoginDefaultImage from '@assets/Avatar.png'
import IconMarketSpace from '@assets/icon-space-market.svg';

import { api } from "@services/api";
import { AppError } from "@utils/app-error";
import { FullButton } from "@components/full-button";
import { SimpleInput } from "@components/simple-input";

import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from '@hookform/resolvers/yup';

import { Controller, useForm } from "react-hook-form";

type FormDataProps = {
  name: string;
  email: string;
  tel: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  tel: yup.string().required('Informe o telefone'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere')
});

export function SignUp() {

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [userPhoto, setUserPhoto] = useState('');
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const { singIn } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });
  
  const navigator = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoSignIn() {
    navigator.navigate('signin');
  }

  async function handleSignUp({ name, email, password, tel }: FormDataProps) {
    try {
      setIsLoading(true);

      if(userPhoto === '') {
        setIsLoading(false);
        toast.show({
          placement: 'top',
          render: () => (
            <Box w='$full' px='$5'>
              <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
                <Text textAlign='center' color='$graySeven'>Por favor, selecione uma foto.</Text>
              </Box>
            </Box>
          )
        });
        return;
      }

      const fileExtension = userPhoto.split('.').pop();

      const photoFile = {
        name: `${name}.${fileExtension}`.toLowerCase(),
        uri: userPhoto,
        type: `image/${fileExtension}`
      } as any;

      const requestBodyUser = new FormData();

      requestBodyUser.append('tel', tel);
      requestBodyUser.append('name', name);
      requestBodyUser.append('email', email);
      requestBodyUser.append('avatar', photoFile);
      requestBodyUser.append('password', password);

      await api.post('/users', requestBodyUser, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await singIn(email, password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde';

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
    }
  }

  async function handleUserPhotoSelected(){
    setPhotoIsLoading(true);
    
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      });
  
      if(photoSelected.canceled) {
        return;
      }

      if(photoSelected.assets[0].uri) {

        if(photoSelected.assets[0].fileSize && 
          (photoSelected.assets[0].fileSize  / 1024 / 1024 ) > 5
        ){          
          toast.show({
            placement: 'top',
            render: () => (
              <Box w='$full' px='$5'>
                <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
                  <Text textAlign='center' color='$graySeven'>Essa imagem é muito grande. Escolha uma de até 5MB.</Text>
                </Box>
              </Box>
            )
          });
          return;
        }
        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Não foi posível selecionar a imagem.</Text>
            </Box>
          </Box>
        )
      });
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return(
    <KeyboardAvoidingView 
      bgColor="$graySix"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <ScrollView bounces={false}>
        <VStack alignItems="center" pt='$16' px='$10' >
          <IconMarketSpace width={60} height={40} />
          <Text fontFamily="$heading" fontSize='$xl' color='$grayOne' mt='$5'>Boas vindas!</Text>

          <Text fontFamily="$body" fontSize='$sm' color='$grayTwo' textAlign="center" mt='$3'>
            Crie sua conta e use o espaço para comprar itens variados e vender seus produtos
          </Text>

          <Box mt='$8'>
            {
              photoIsLoading || !userPhoto ?
                <Image
                  w='$24'
                  h='$24'
                  source={LoginDefaultImage}
                  alt='Imagem de carregamento login'
                />
                :
                <Image
                  w='$24'
                  h='$24'
                  rounded="$full"
                  source={{ uri: userPhoto }}
                  alt='Imagem de login'
                />
            }

            <Pressable w={40} h={40} 
              right={0}
              bottom={0}
              alignItems="center"
              position="absolute"
              borderRadius='$full'
              bgColor="$blueLight"
              justifyContent="center"
              onPress={handleUserPhotoSelected}
            >
              <PencilSimpleLine size={16} color="#EDECEE" />
            </Pressable>
          </Box>

          <VStack mt='$5'>
            <Controller 
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <SimpleInput 
                  label="Nome" 
                  onChangeText={onChange} 
                  value={value} 
                />
              )}
            />
            { errors.name && 
              <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$redLight'>
                {errors.name.message}
              </Text>
            }

            <Controller 
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <SimpleInput 
                  label="E-mail"
                  autoCapitalize="none"
                  keyboardType="email-address" 
                  onChangeText={onChange} 
                  value={value} 
                />
              )}
            />
            { errors.email &&  
              <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$redLight'>
                {errors.email.message}
              </Text>
            }

            <Controller 
              control={control}
              name="tel"
              render={({ field: { value, onChange } }) => (
                <SimpleInput 
                  label="Telefone" 
                  keyboardType="numeric"
                  onChangeText={onChange} 
                  value={value} 
                />
              )}
            />
            { errors.tel &&  
              <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$redLight'>
                {errors.tel.message}
              </Text> 
            }

            <Controller 
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <SimpleInput 
                  label="Senha" 
                  isPassword
                  onChangeText={onChange} 
                  value={value} 
                />
              )}
            />
            { errors.password &&  
              <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$redLight'>
                {errors.password.message}
              </Text> 
            }

            <Controller 
              control={control}
              name="password_confirm"
              render={({ field: { value, onChange } }) => (
                <SimpleInput 
                  isPassword
                  label="Confirmar senha" 
                  onChangeText={onChange} 
                  value={value} 
                />
              )}
            />
            { errors.password_confirm &&  
              <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$redLight'>
                {errors.password_confirm.message}
              </Text>
            }
          </VStack>

          <Box mt='$8' w='$full'>
            <FullButton 
              label="Criar"
              bgColor="$grayOne"
              isLoading={isLoading}
              labelColor="$graySeven"
              onPress={handleSubmit(handleSignUp)}
            />
          </Box>

          <Box mt='$12' pb='$10' w='$full'>
            <Text fontFamily='$body' textAlign="center" fontSize='$sm' color='$grayTwo'>Já tem uma conta?</Text>
            <Box mt='$4' w='$full'>
              <FullButton 
                bgColor="$grayFive"
                labelColor="$grayTwo" 
                label="Ir para o login" 
                onPress={handleGoSignIn}
              />
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
