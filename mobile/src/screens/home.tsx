import { 
  useState,
  useCallback,
} from "react";

import { FlatList } from "react-native";

import { 
  Box,
  Text,
  Center,
  VStack,
  HStack,
  useToast,
  Pressable,
} from "default-theme";

import { MagnifyingGlass, Sliders, ListBullets } from 'phosphor-react-native';

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Loading } from "@components/loading";
import { HeaderHome } from "@components/header-home";
import { SimpleInput } from "@components/simple-input";
import { ProductItemList } from "@components/product-item-list";
import FilterModal, { Filters } from "@components/filter-modal";
import { AdvertisementsCard } from "@components/advertisements-card";

import { api } from "@services/api";

import { AppError } from "@utils/app-error";

import { ProductDTO } from "@dtos/ProductDTO";

export function Home() {

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [showFilterModal, setFilterShowModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [productList, setProductList] = useState<ProductDTO[]>([]);
  
  const navigator = useNavigation<AppNavigatorRoutesProps>();

  function applyFilterModal(filters: Filters) {
    handleApplyQuickSearch(filters);
  }

  function RemoveFiltersApplied() {
    setQuickSearch('');
    handleApplyQuickSearch();
  }

  async function handleApplyQuickSearch(filters?: Filters) {
    try {
      setIsLoading(true);
      setIsFilterApplied(true);
      let paramsFilter: Filters = {
        query: quickSearch
      };

      if (quickSearch === '' && filters) {
        paramsFilter = {
          is_new: filters?.is_new,
          accept_trade: filters?.accept_trade,
          payment_methods: filters?.payment_methods
        }
      }

      if (quickSearch === '' && !filters) {
        setIsFilterApplied(false);
      }
      
      const response = await api.get('/products', { params: paramsFilter });

      const listProducts = response.data.map((item: ProductDTO) => {
        item.is_active = true;
        return item;
      });
      
      setProductList(listProducts);
      setQuickSearch('');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível filtrar a lista de produtos.';

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>{ title }</Text>
            </Box>
          </Box>
        )
      });
    } finally {
      setIsLoading(false);
    }
  }

  function openItem(item: ProductDTO) {
    setIsFilterApplied(false);
    navigator.navigate('advertisementsDetail', { idProduct: item.id });
  }

  async function loadAdsData() {
    try {
      setIsLoading(true);
      const response = await api.get('/products');

      const listProducts = response.data.map((item: ProductDTO) => {
        item.is_active = true;
        return item;
      });

      setProductList(listProducts);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar a lista de produtos.';

      toast.show({
        placement: 'top',
        render: () => (
          <Box w='$full' px='$5'>
            <Box borderRadius='$lg' bgColor="$rose700" p='$3'>
              <Text textAlign='center' color='$graySeven'>{ title }</Text>
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
      loadAdsData();
    },[])
  );

  return (
    <VStack flex={1}>
      <VStack px='$6' alignItems="flex-start">
        <HeaderHome />

        <Text mt='$10' fontFamily='$body' fontSize='$sm' textAlign="center" color='$grayThree'>
          Seus produtos anunciados para venda
        </Text>

        <AdvertisementsCard />

        <HStack w='$full' pt='$8' justifyContent='space-between' alignItems='center' >
          <Text fontFamily='$body' fontSize='$sm' textAlign="center" color='$grayThree'>
            Compre produtos variados
          </Text>

          { isFilterApplied &&
            <Pressable 
              h='$8' 
              px='$2'
              borderRadius='$3xl'
              alignItems='center'
              bgColor="$grayFive"
              justifyContent='center'
              onPress={RemoveFiltersApplied}
            >
              <Text fontFamily='$body' fontSize='$xs' textAlign="center" color='$grayTwo'>
                Remover filtros
              </Text>
            </Pressable>
          }
        </HStack>

        <SimpleInput
          value={quickSearch}
          label="Buscar anúncio"
          onChangeText={setQuickSearch}
          onSubmitEditing={() => handleApplyQuickSearch()}
          children={
            <HStack mr='$2'>
              <Pressable w='$10' justifyContent='center' p='$3' alignItems='center' onPress={() => handleApplyQuickSearch()}>
                <MagnifyingGlass color="#3E3A40" size={20} weight="bold" />
              </Pressable>

              <Box w={2} justifyContent='center' alignItems='center'> 
                <Box w={2} h='$5' bgColor='$grayFive'></Box>
              </Box>

              <Pressable onPress={() => setFilterShowModal(true)} w='$10' justifyContent='center' p='$3' alignItems='center'>
                <Sliders color="#3E3A40" size={20} weight="bold" />
              </Pressable>
            </HStack>
          }
        />
      </VStack>

      <Box flex={1} px='$6'>
        { isLoading ? <Loading /> :
          <FlatList
            numColumns={2}
            data={productList}
            style={{ marginTop: 20}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 15, flex: 1 }}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item, index }) => (
              <ProductItemList
                key={item.id + index}
                userImage={item.user?.avatar}
                product={item}
                openProduct={() => openItem(item)}
              />
            )}
            ListEmptyComponent={() => 
              <Center flex={1}>
                <ListBullets size={42} color='#9F9BA1' />
                <Text mt='$3' fontFamily='$body' fontSize='$sm' textAlign="center" color='$grayThree'>
                  Não existem produtos para serem exibidos
                </Text>
              </Center>
            }
          />
        }
      </Box>
      
      <Box h={1}>
        <FilterModal
          isVisible={showFilterModal}
          applyFilters={applyFilterModal}
          isFilterApplied={isFilterApplied}
          closeModal={() => setFilterShowModal(false)}
        />
      </Box>
    </VStack>
  );
}
