import { 
  Text,
  HStack 
} from "default-theme";

import {
  Bank,
  Money,
  QrCode,
  Barcode,
  CreditCard
} from 'phosphor-react-native';

import { PaymentTypes } from '@components/filter-modal';

type PaymentTypeIconsProps = {
  paymentType: PaymentTypes;
};

export function PaymentTypeIcons({ paymentType } : PaymentTypeIconsProps) {
  return(
    <>
      { paymentType === 'boleto' &&
        <HStack mt='$2'>
          <Barcode size={18}/>
          <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>Boleto</Text>
        </HStack>
      }

      { paymentType === 'pix' &&
        <HStack mt='$2'>
          <QrCode size={18}/>
          <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>Pix</Text>
        </HStack>
      }

      { paymentType === 'cash' &&
        <HStack mt='$2'>
          <Money size={18}/>
          <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>Dinheiro</Text>
        </HStack>
      }

      { paymentType === 'card' &&
        <HStack mt='$2'>
          <CreditCard size={18}/>
          <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>Cartão de Crédito</Text>
        </HStack>
      }

      { paymentType === 'deposit' &&
        <HStack mt='$2'>
          <Bank size={18}/>
          <Text ml='$3' fontFamily='$body' fontSize='$sm' color='$grayTwo'>Depósito Bancário</Text>
        </HStack>
      }
    </>
  );
}