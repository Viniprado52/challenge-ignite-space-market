import { 
  Center,
  Spinner
} from "default-theme";

export function Loading() {
  return(
    <Center flex={1}>
      <Spinner color='$blueLight' />
    </Center>
  );
}