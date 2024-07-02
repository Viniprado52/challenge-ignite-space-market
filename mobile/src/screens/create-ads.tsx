import { 
  useState,
  useCallback,
} from "react";

import { Platform } from "react-native";

import { useProduct } from "@hooks/useProduct";
import { Controller, useForm } from "react-hook-form";

import { 
  Box,
  Text,
  Radio,
  HStack,
  VStack,
  Switch,
  Center,
  useToast,
  Textarea,
  Pressable,
  RadioGroup,
  ScrollView,
  TextareaInput,
  CheckboxGroup,
  KeyboardAvoidingView,
} from "default-theme";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { Plus } from "phosphor-react-native";

import { Header } from "@components/header";
import { FullButton } from "@components/full-button";
import { SimpleInput } from "@components/simple-input";
import { ImageItemProduct } from "@components/image-item-product";
import { PaymentCheckBoxItem } from "@components/payment-checkbox-item";

import * as ImagePicker from 'expo-image-picker';

import { ProductDTO } from "@dtos/ProductDTO";

import { config } from "default-theme/gluestack-ui.config";

import { ImageProduct } from "@contexts/ProductContext";

type Condition = 'NEW' | 'OLD';

type PaymentTypes = 'boleto' | 'pix' | 'cash' | 'card' | 'deposit';

type FormData = {
  name: string;
  description: string;
  price: string;
};

type RouteParams = {
  callBackRoute: string;
};

export function CreateAds() {

  const toast = useToast();
  const route = useRoute();

  const { callBackRoute } = route.params as RouteParams;
  const { setProductToCreate, setProductImagesToCreate } = useProduct();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const [acceptExchange, setAcceptExchange] = useState(false);
  const [productImageList, setProductImageList] = useState<string[]>([]);
  const [conditionProduct, setConditionProduct] = useState<Condition>('NEW');
  const [paymentTypesAccept, setPaymentTypesAccept] = useState<PaymentTypes[]>([]);

  const { colors } = config.tokens;

  const navigator = useNavigation<AppNavigatorRoutesProps>();

  function handleGoBack() {
    navigator.navigate(callBackRoute === 'home' ? 'home' : 'myAdvertisements');
  }

  function handlePrepareProductAndGoPreview({ description, name, price } : FormData) {
    const newProduct: ProductDTO = {
      id: '',
      name,
      description,
      is_active: true,
      accept_trade: acceptExchange,
      is_new: conditionProduct === 'NEW',
      payment_methods: paymentTypesAccept,
      price: parseFloat(price.replace(',', '.'))
    };

    if (productImageList.length === 0) {
      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>Seleciona pelo menos uma imagem para o produto.</Text>
            </Box>
          </Box>
        )
      });
      return;
    }

    const imagesIclude: Array<ImageProduct> = [];
    productImageList.forEach(item => {
      imagesIclude.push({ path: item });
    });

    setProductToCreate(newProduct);
    setProductImagesToCreate(imagesIclude);

    navigator.navigate('advertisementsView', { callBackRoute: 'advertisementsCreate'});
  }

  function handleRemoveImageProduct(indexRemove: number) {
    const currentList = productImageList;
    const newList = currentList.filter((_, index) => index !== indexRemove);
    setProductImageList(newList);
  }

  async function handleUserPhotoSelected(){
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
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

        setProductImageList((currentValue) => [photoSelected.assets[0].uri, ...currentValue]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function resetFormData() {
    reset({
     name: '',
     price: '',
     description: ''
    });

    setProductImageList([]);
    setAcceptExchange(false);
    setPaymentTypesAccept([]);
    setConditionProduct('NEW');
  }

  useFocusEffect(useCallback(() => {
    if (callBackRoute !== 'advertisementsView') {
      resetFormData();
    }
  }, []));

  return(
    <KeyboardAvoidingView 
      enabled
      flex={1}
      bgColor="$graySix"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box mt='$16' px='$5' >
        <Header
          title="Criar anúncio"
          backAction={handleGoBack}
        />
      </Box>

      <ScrollView px='$5' showsVerticalScrollIndicator={false} pb='$20'>
        <Text mt='$5' fontFamily='$heading' fontSize='$md' color='$grayTwo'>Imagens</Text>
        <Text mt='$2' fontFamily='$body' fontSize='$sm' color='$grayTree'>
          Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
        </Text>

        <HStack mt='$5'>
          {
            productImageList.map((item, index) => (
              <ImageItemProduct
                image={item}
                key={item + index + 'create'}
                onRemove={() => handleRemoveImageProduct(index)}
              />
            ))
          }

          { productImageList.length < 3 &&
            <Pressable 
              w='$24'
              h='$24' 
              borderRadius='$md'
              bgColor="$grayFive" 
              onPress={handleUserPhotoSelected}
            >
              <Center flex={1}>
                <Plus size={24} color={colors.grayFour} />
              </Center>
            </Pressable>
          }
        </HStack>

        <Text mt='$5' fontFamily='$heading' fontSize='$md' color='$grayTwo'>
          Sobre o produto
        </Text>

        <Controller 
          name="name"
          control={control}
          rules={{ required: 'Informe o nome do produto' }}
          render={({ field: { onChange, value } }) => (
            <SimpleInput
              value={value}
              label="Título do anúncio"
              onChangeText={onChange}
            />
          )}
        />
        { errors.name &&
          <Text mt='$2' w='$full' fontFamily='$body' fontSize='$sm' color='$redLight'>
            { errors.name.message }
          </Text>
        }

        <Controller 
          control={control}
          name="description"
          rules={{ required: 'Informe descrição do produto' }}
          render={({ field: { onChange, value } }) => (
            <Textarea
              mt='$4'
              size='md'
              borderWidth={0}
              borderRadius='$md'
              bgColor='$graySeven'
            >
              <TextareaInput
                value={value}
                keyboardType="default"
                onChangeText={onChange}
                placeholderTextColor={colors.grayFour}
                placeholder='Descrição do produto'
              />
            </Textarea>
          )}
        />
        { errors.description &&
          <Text mt='$2' w='$full' fontFamily='$body' fontSize='$sm' color='$redLight'>
            { errors.description.message }
          </Text>
        }
        
        <RadioGroup mt='$4' w='$full' py='$3' value={conditionProduct} onChange={(value) => setConditionProduct(value)}>
          <HStack w='$full'>
            <Radio flex={1} value="NEW" size="md" >
              <Box 
                w='$6'
                h='$6'
                borderWidth={1.5}
                alignItems='center'
                borderRadius='$full'
                justifyContent='center'
                borderColor={conditionProduct === 'NEW' ? "$blueLight": "$grayFour"}
              >
                { conditionProduct === 'NEW' && 
                  <Box 
                    w='$4' 
                    h='$4' 
                    borderRadius='$full' 
                    bgColor="$blueLight"
                  ></Box> 
                }
              </Box>
              <Text fontFamily='$body' fontSize='$md' color='$grayTwo' ml='$3'>Produto novo</Text>
            </Radio>

            <Radio flex={1} value="OLD" size="md" >
              <Box 
                w='$6'
                h='$6'
                borderWidth={1.5}
                borderRadius='$full'
                justifyContent='center' alignItems='center'
                borderColor={conditionProduct === 'OLD' ? "$blueLight": "$grayFour"}
              >
                { conditionProduct === 'OLD' &&
                  <Box 
                    w='$4' 
                    h='$4'
                    borderRadius='$full'
                    bgColor="$blueLight"
                  ></Box>
                }
              </Box>
              <Text fontFamily='$body' fontSize='$md' color='$grayTwo' ml='$3'>Produto usado</Text>
            </Radio>
          </HStack>
        </RadioGroup>

        <Text mt='$5' fontFamily='$heading' fontSize='$md' color='$grayTwo'>
          Venda
        </Text>

        <Controller 
          name="price"
          control={control}
          rules={{ required: 'Informe o valor do produto' }}
          render={({ field: { onChange, value } }) => (
            <SimpleInput
              value={value}
              isCash={true}
              onChangeText={onChange}
              label="Valor do produto"
              keyboardType="number-pad"
            />
          )}
        />
        { errors.price &&
          <Text mt='$2' w='$full' fontFamily='$body' fontSize='$sm' color='$redLight'>
            { errors.price.message }
          </Text>
        }

        <Text mt='$8' fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
          Aceita troca?
        </Text>

        <Box mt={Platform.OS === 'ios' ? '$3' : '$1'} w='$12'>
          <Switch
            size="md"
            isDisabled={false}
            value={acceptExchange}
            onToggle={setAcceptExchange}
            sx={{
              _light: {
                props: {
                  trackColor: {
                    false: '$grayFive',
                    true: "$blueLight",
                  },
                  thumbColor: '$graySeven',
                }
              }
            }}
          />
        </Box>

        <Text mt={Platform.OS === 'ios' ? '$8' : '$3'} fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
          Meios de pagamento aceitos
        </Text>

        <VStack mt='$3' pb='$8'>
          <CheckboxGroup
            value={paymentTypesAccept}
            onChange={(payments) => {
              setPaymentTypesAccept(payments);
            }}
          >
            <VStack>
              <PaymentCheckBoxItem
                key={'boleto'}
                value="boleto"
                label="Boleto"
                isActive={paymentTypesAccept.includes('boleto')}
              />

              <PaymentCheckBoxItem
                key={'pix'}
                value="pix"
                label="Pix"
                isActive={paymentTypesAccept.includes('pix')}
              />

              <PaymentCheckBoxItem
                key={'cash'}
                value="cash"
                label="Dinheiro"
                isActive={paymentTypesAccept.includes('cash')}
              />

              <PaymentCheckBoxItem
                key={'card'}
                value="card"
                label="Cartão de Crédito"
                isActive={paymentTypesAccept.includes('card')}
              />

              <PaymentCheckBoxItem
                key={'deposit'}
                value="deposit"
                label="Depósito Bancário"
                isActive={paymentTypesAccept.includes('deposit')}
              />
            </VStack>
          </CheckboxGroup>
        </VStack>
      </ScrollView>
      
      <HStack w='$full' h='$24' bgColor="$graySeven" px='$8' pt='$5'>
        <Box flex={1}>
          <FullButton
            label="Cancelar"
            bgColor="$grayFive"
            labelColor="$grayTwo"
            onPress={handleGoBack}
          />
        </Box>

        <Box w='$5' h='$3'></Box>

        <Box flex={1}>
          <FullButton
            label="Avançar"
            bgColor="$grayOne"
            labelColor="$graySeven"
            onPress={handleSubmit(handlePrepareProductAndGoPreview)}
          />
        </Box>
      </HStack>
    </KeyboardAvoidingView>
  );
}