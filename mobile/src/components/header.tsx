import { 
  Box,
  Text,
  HStack,
  Pressable,
} from "default-theme";

import { 
  Plus,
  ArrowLeft,
  PencilSimpleLine,
} from 'phosphor-react-native'; 

import { config } from "default-theme/gluestack-ui.config";

type HeaderProps = {
  title?: string;
  backAction?: () => void;
  editAction?: () => void;
  addAction?: () => void;
};

export function Header({ 
  title = '', 
  addAction = undefined,
  backAction = undefined, 
  editAction = undefined 
} : HeaderProps) {

  const colors = config.tokens.colors;

  return(
    <HStack w='$full' h='$12' alignItems='center'>
      <Box flex={1}>
        { backAction &&
          <Pressable onPress={backAction}>
            <ArrowLeft size={24} color={colors.grayOne} />
          </Pressable>
        }
      </Box>

      <Text flex={2} fontFamily='$heading' fontSize='$xl' textAlign='center' color='$grayOne'>
        { title }
      </Text>

      <Box flex={1}>
        { editAction ?
            <Pressable flexDirection="row" justifyContent='flex-end' onPress={editAction}>
              <PencilSimpleLine size={24} color={colors.grayOne} />
            </Pressable>
          :
          addAction &&
            <Pressable flexDirection="row" justifyContent='flex-end' onPress={addAction}>
              <Plus size={24} color={colors.grayOne} />
            </Pressable>
        }
      </Box>
    </HStack>
  );
}