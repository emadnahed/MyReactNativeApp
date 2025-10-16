/**
 * Movie Search App
 * Built with React Native, Redux Toolkit, and RTK Query
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/store';
import ErrorBoundary from './src/components/ErrorBoundary';
import SearchScreen from './src/screens/SearchScreen';
import { FontFamilies } from './src/constants/fonts';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider
          style={{ backgroundColor: '#121212' }} // Ensure consistent background
>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1E1E1E',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: FontFamilies.Gilroy.Heavy,                  
                  fontSize: 20,
                },
                contentStyle: {
                  backgroundColor: '#121212',
                },
              }}>
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                  title: 'Movie Search',
                  headerTitleAlign: 'center',                
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
