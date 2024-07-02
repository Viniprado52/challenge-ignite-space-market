import { Center, Text } from "default-theme";

type BadgeProps = {
  label: string;
  labelColor: string;
  backgroundColor: string;
}

export function Badge({ label, labelColor, backgroundColor } : BadgeProps) {
  return(
    <Center bgColor={backgroundColor} p='$1'  borderRadius='$full'>
      <Text 
        fontFamily='$heading' 
        fontSize='$2xs' 
        color={labelColor}
      >
        {label.toUpperCase()}
      </Text>
    </Center>
  );
}