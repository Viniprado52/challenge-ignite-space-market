import {
  useRef,
  useState,
  useCallback,
} from "react";

import { Modal, Platform } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  CheckboxGroup,
  Switch,
} from "default-theme";

import { X as CloseIcon } from 'phosphor-react-native';

import { FullButton } from "./full-button";
import { ButtonOption } from "./button-option";
import { PaymentCheckBoxItem } from "./payment-checkbox-item";

import BottomSheet from "@gorhom/bottom-sheet";

import { config } from "default-theme/gluestack-ui.config";

import { gestureHandlerRootHOC } from "react-native-gesture-handler";

type FilterModalProps = {
  isVisible: boolean;
  closeModal: () => void;
  applyFilters: (filter:Filters) => void;
  isFilterApplied: boolean;
};

export type Filters = {
  query?: string;
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods?: Array<PaymentTypes>;
};

type Condition = 'NEW' | 'OLD';
export type PaymentTypes = 'boleto' | 'pix' | 'cash' | 'card' | 'deposit';

function FilterModal({ isVisible, closeModal, applyFilters, isFilterApplied } : FilterModalProps) {

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [condition, setCondition] = useState<Condition>('NEW');
  const [acceptExchange, setAcceptExchange] = useState(false);
  const [paymentTypesAccept, setPaymentTypesAccept] = useState<PaymentTypes[]>([]);

  const { colors } = config.tokens;

  function handleApplyFilters() {
    const filters: Filters = {
      is_new: condition === 'NEW',
      accept_trade: acceptExchange,
      payment_methods: paymentTypesAccept
    };

    applyFilters(filters);
    handleCloseBottomShet();
  }

  function handleCloseBottomShet() {
    bottomSheetRef.current?.close();
    closeModal();
  }

  function handleResetFilters() {
    setCondition('NEW');
    setAcceptExchange(false);
    setPaymentTypesAccept([
      'boleto',
      'pix',
      'cash',
      'card',
      'deposit'
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      if (!isFilterApplied) {
        handleResetFilters();
      }
    },[isVisible])
  );
  
  return(
    <Modal
      aria-modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={handleCloseBottomShet}
    >
      <VStack
        flex={1} 
        flexDirection="column"
        justifyContent="flex-end"
        bgColor='rgba(0, 0, 0, 0.6)'
      >
        <BottomSheet
          index={1}
          enablePanDownToClose
          ref={bottomSheetRef}
          snapPoints={['70%', '70%']}
          onClose={handleCloseBottomShet}
          backgroundStyle={{ backgroundColor: '#EDECEE'}}
          handleIndicatorStyle={{ backgroundColor: '#D9D8DA'}}
        >
          <VStack
            w='$full'
            px='$8'
            h='$full'
            bgColor="$graySix"
            borderTopLeftRadius='$3xl'
            borderTopRightRadius='$3xl'
          > 
            <HStack mt='$5' alignItems="center">
              <Text flex={1} fontFamily='$heading' fontSize='$xl' color='$grayOne'>Filtrar anúncios</Text>
              <Pressable p='$2' onPress={handleCloseBottomShet} >
                <CloseIcon size={24} color={colors.grayFour}/>
              </Pressable>
            </HStack>

            { isFilterApplied &&
              <Text fontFamily='$body' fontSize='$xs' textAlign="left" color='$grayTwo'>
                *Existem filtros aplicados
              </Text>
            }

            <Text mt='$8' fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
              Condição
            </Text>

            <HStack mt='$3'>
              <ButtonOption 
                label="NOVO"
                isActive={condition === 'NEW'}
                onPress={() => setCondition('NEW')}
              />
              <ButtonOption 
                label="USADO"
                isActive={condition === 'OLD'}
                onPress={() => setCondition('OLD')}
              />
            </HStack>

            <Text mt='$8' fontFamily='$heading' fontSize='$sm' color='$grayTwo'>
              Aceita troca?
            </Text>

            <Box mt={Platform.OS === 'ios' ? '$3' : '$1'} w='$12'>
              <Switch
                size="md"
                isDisabled={false}
                value={acceptExchange}
                onToggle={ () => setAcceptExchange(!acceptExchange)}
                sx={{
                  _light: {
                    props: {
                      trackColor: {
                        false: '$grayFive',
                        true: '$blueLight'
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

            <VStack mt='$3'>
              <CheckboxGroup
                value={paymentTypesAccept}
                onChange={(payments) => {
                  setPaymentTypesAccept(payments);
                }}
              >
                <VStack>
                  <PaymentCheckBoxItem
                    value="boleto"
                    label="Boleto"
                    isActive={paymentTypesAccept.includes('boleto')}
                  />

                  <PaymentCheckBoxItem
                    value="pix"
                    label="Pix"
                    isActive={paymentTypesAccept.includes('pix')}
                  />

                  <PaymentCheckBoxItem
                    value="cash"
                    label="Dinheiro"
                    isActive={paymentTypesAccept.includes('cash')}
                  />

                  <PaymentCheckBoxItem
                    value="card"
                    label="Cartão de Crédito"
                    isActive={paymentTypesAccept.includes('card')}
                  />

                  <PaymentCheckBoxItem
                    value="deposit"
                    label="Depósito Bancário"
                    isActive={paymentTypesAccept.includes('deposit')}
                  />
                </VStack>
              </CheckboxGroup>
            </VStack>

            <HStack position="absolute" bottom={40} left='$8'>
              <Box flex={1}>
                <FullButton
                  bgColor="$grayFive"
                  labelColor="$grayTwo"
                  label="Resetar filtros"
                  onPress={handleResetFilters}
                />
              </Box>
              <Box w='$3'></Box>
              
              <Box flex={1}>
                <FullButton
                  bgColor="$grayOne"
                  labelColor="$graySeven"
                  label="Aplicar filtros"
                  onPress={handleApplyFilters}
                />
              </Box>
            </HStack>
          </VStack>
        </BottomSheet>
      </VStack>
    </Modal>
  ); 
}

export default gestureHandlerRootHOC(FilterModal);