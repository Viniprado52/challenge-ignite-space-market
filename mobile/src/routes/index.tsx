import { AuthRoutes } from './auth.routes';

import { NavigationContainer } from '@react-navigation/native';

import { Box } from 'default-theme';
import { AppRoutes } from './app.routes';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/loading';

export function PublicRoutes() {

	const { user, isLoadingUserStorageData } = useAuth();

	if(isLoadingUserStorageData) {
    return <Loading />
  }
	
  return (
	  <Box flex={1} bgColor='$graySix'>
	    <NavigationContainer>
				{ user?.id ? <AppRoutes /> : <AuthRoutes /> }
	    </NavigationContainer>
    </Box>
  );
}