import { Platform } from 'react-native';
 
import {
  BottomTabNavigationProp,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  Tag as TagIcon,
  House as HouseIcon,
  SignOut as SignOutIcon
} from 'phosphor-react-native';

import { Home } from '@screens/home';
import { MyAds } from '@screens/my-ads';
import { SignOut } from '@screens/signout';
import { AdsEdit } from '@screens/ads-edit';
import { AdsDetail } from '@screens/ads-detail';
import { MyAdsDetail } from '@screens/my-ads-detail';

import { config } from 'default-theme/gluestack-ui.config';
import { PreviewAds } from '@screens/preview-ads';
import { CreateAds } from '@screens/create-ads';

type AppRoutes = {
  home: undefined;
  signout: undefined;
  myAdvertisements: undefined;
  advertisementsEdit: undefined;
  advertisementsView: {
    callBackRoute: string;
  };
  advertisementsCreate: {
    callBackRoute: string;
  };
  advertisementsDetail: {
    idProduct: string;
  };
  myAdvertisementsDetail: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {

  const sizes = config.tokens.space;
  const colors = config.tokens.colors;
  const iconSize = sizes[6];

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.grayTwo,
      tabBarInactiveTintColor: colors.grayFour,
      tabBarStyle: {
        borderTopWidth: 0,
        paddingTop: sizes[6],
        paddingBottom: sizes[10],
        backgroundColor: colors.graySeven,
        height: Platform.OS === "android" ? 'auto' : 96,
      }
    }}>
      <Screen 
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HouseIcon color={color} size={iconSize} />
          )
        }}
      />

      <Screen 
        name='myAdvertisements'
        component={MyAds}
        options={{
          tabBarIcon: ({ color }) => (
            <TagIcon color={color} size={iconSize} />
          )
        }}
      />

      <Screen 
        name='signout'
        component={SignOut}
        options={{
          tabBarIcon: () => (
            <SignOutIcon color={colors.redLight} size={iconSize} />
          )
        }}
      />

      <Screen 
        name='advertisementsDetail'
        component={AdsDetail}
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          }
        }}
      />

      <Screen 
        name='myAdvertisementsDetail'
        component={MyAdsDetail}
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          }
        }}
      />

      <Screen 
        name='advertisementsEdit'
        component={AdsEdit}
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          }
        }}
      />

      <Screen 
        name='advertisementsView'
        component={PreviewAds}
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          }
        }}
      />

      <Screen 
        name='advertisementsCreate'
        component={CreateAds}
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          }
        }}
      />
    </Navigator>
  );
}