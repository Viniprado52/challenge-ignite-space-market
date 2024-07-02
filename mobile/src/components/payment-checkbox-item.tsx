import { 
  Text,
  Checkbox,
  CheckboxIndicator,
} from "default-theme";

import { Check } from 'phosphor-react-native';

import { config } from "default-theme/gluestack-ui.config";

type PaymentCheckBoxItemProps = {
  value: string;
  label: string;
  isActive: boolean;
};

export function PaymentCheckBoxItem({ value, isActive, label } : PaymentCheckBoxItemProps) {

  const { colors } = config.tokens;

  return(
    <Checkbox mt='$2' value={value} aria-label={`Select ${value} payment`}>
      <CheckboxIndicator 
        mr="$2" 
        borderColor="$grayFour"
        borderWidth={isActive ? 0 : 1}
        bgColor={isActive ? '$blueLight' : 'transparent'}
      >
        { isActive && <Check size={12} color={colors.white} /> }
      </CheckboxIndicator>
      
      <Text fontFamily='$body' fontSize='$md' color='$grayTwo'>{ label }</Text>
    </Checkbox>
  );
}