import { 
  useState,
  useCallback
} from "react";

import { FlatList } from "react-native";

import { useProduct } from "@hooks/useProduct";

import {
  Box,
  Text,
  VStack,
  HStack, 
  Select, 
  useToast,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectContent,
} from "default-theme";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Placeholder, SlidersHorizontal, Tag, CaretDown } from 'phosphor-react-native';

import { config } from "default-theme/gluestack-ui.config";

import { Header } from "@components/header";
import { Loading } from "@components/loading";
import { ProductItemList } from "@components/product-item-list";

import { api } from "@services/api";

import { AppError } from "@utils/app-error";

import { ProductDTO } from "@dtos/ProductDTO";

type ProductStatusFilter = {
  id: string;
  label: string;
};

export function MyAds() {
  
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [adsFilterStatus, setAdsFilterStatus] = useState<ProductStatusFilter>({
    id: 'ALL', 
    label: 'Todos'
  });
  
  const [productList, setProductList] = useState<ProductDTO[]>([]);
  const [productListFiltered, setProductListFiltered] = useState<ProductDTO[]>([]);

  const { setProductToCreate } = useProduct();

  const navigator = useNavigation<AppNavigatorRoutesProps>();

  const colors = config.tokens.colors;

  function openItem(item: ProductDTO) {
    setProductToCreate(item);
    navigator.navigate('myAdvertisementsDetail');
  }

  function handleOpenIncludeAd() {
    navigator.navigate('advertisementsCreate', { callBackRoute: 'myAdvertisements' });
  }

  function handleSelectFilter(status: string) {
    let newStatus: ProductStatusFilter = {id: 'ALL', label: 'Todos'};
    let productListFiltered: Array<ProductDTO> = [];

    if(status === 'ACTIVE') {
      newStatus = { id: status, label: 'Ativos' };
      productListFiltered = productList.filter(item => item.is_active);
    }

    if(status === 'INACTIVE') {
      newStatus = { id: status, label: 'Inativos' };
      productListFiltered = productList.filter(item => !item.is_active);
    }

    if(status === 'ALL') {
      newStatus = { id: status, label: 'Todos' };
      productListFiltered = productList;
    }

    setAdsFilterStatus(newStatus);
    setProductListFiltered(productListFiltered);
  }

  async function loadMyAdsData() {
    try {
      setIsLoading(true);
      const response = await api.get('/users/products');

      setProductList(response.data);
      setProductListFiltered(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar a lista de produtos.';

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
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadMyAdsData();
    },[])
  )

  return (
    <VStack flex={1}>
      <Box mt='$16' px='$8'>
        <Header
          addAction={handleOpenIncludeAd}
          title='Meus anúncios'
        />
      </Box>

      <VStack flex={1}  mt='$5'>
        <HStack px='$5'justifyContent='space-between' alignItems='center'>
          { productListFiltered.length !== 1 ?
            <Text fontFamily='$body' fontSize='$sm' color='$grayTwo'>
              { productListFiltered.length } anúncios
            </Text>
            :
            <Text fontFamily='$body' fontSize='$sm' color='$grayTwo'>
              { productListFiltered.length } anúncio
            </Text>
          }
          
          <Select onValueChange={(value) => handleSelectFilter(value)}>
            <SelectTrigger size="md" borderColor="$grayFive">
              <HStack p='$5'>
                <Text fontFamily='$body' fontSize='$sm' color='$grayOne' mr='$5'>{ adsFilterStatus.label }</Text>
                <CaretDown size={18} color={colors.grayThree}/>
              </HStack>
            </SelectTrigger>

            <SelectPortal bgColor='rgba(0, 0, 0, 0.6)'>
              <SelectContent
                pl='$5'
                bgColor="$grayFive" 
                justifyContent='center'
                alignItems='center' w='$full' pb='$16' pt='$12'
              > 
                <HStack alignItems="center" pl='$5'>
                  <SlidersHorizontal  size={18} color={colors.grayThree}/>
                  <SelectItem label="Todos os anúncios" value="ALL" />
                </HStack>

                <HStack alignItems="center" pl='$5'>
                  <Tag size={18} color={colors.grayThree}/>
                  <SelectItem label="Somente anúncios ativos" value="ACTIVE" />
                </HStack>

                <HStack alignItems="center" pl='$5'>
                  <Placeholder size={18} color={colors.grayThree}/>
                  <SelectItem label="Somente anúncios inativos" value="INACTIVE" />
                </HStack>
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>

        <Box flex={1} px='$2'>
          {
            isLoading ? <Loading /> :
            <FlatList
              numColumns={2}
              style={{ marginTop: 20}}
              data={productListFiltered}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 15}}
              keyExtractor={(item, index) => item.id + index}
              renderItem={({ item }) => (
                <ProductItemList
                  product={item}
                  openProduct={() => openItem(item)}
                />
              )}
            />
          }
        </Box>
      </VStack>
    </VStack>
  );
}