/**
 * Movie Search App
 * Built with React Native, Redux Toolkit, and RTK Query
 *
 * @format
 */

import React from 'react';
import { StatusBar, View, TouchableOpacity, Text, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import SearchScreen from './src/screens/SearchScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import { store } from './src/store';
import { FontFamilies } from './src/constants/fonts';
import type { RootStackParamList } from './src/types/navigation.types';
import { useSelector } from 'react-redux';
import { RootState } from './src/store';

const Stack = createNativeStackNavigator<RootStackParamList>();


const linking = {
  prefixes: ['myreactnativeapp://', 'https://myreactnativeapp.com'],
  config: {
    screens: {
      Search: 'search',
      MovieDetails: 'movie/:movieId',
    },
  },
};

const CustomHeader = ({ title, onGoBack }: { title: string; onGoBack?: () => void }) => {
  const movieTitle = useSelector((state: RootState) => state.movie.currentMovieTitle);
  const displayTitle = movieTitle || title;

  // Truncate title to maximum 25 characters for better fit
  const truncatedDisplayTitle = displayTitle.length > 25
    ? `${displayTitle.substring(0, 22)}...`
    : displayTitle;

  return (
    <View style={{
      height: 120,
      backgroundColor: '#1E1E1E',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      position: 'relative',
      // marginBottom: 60,
    }}>
      {onGoBack && (
        <TouchableOpacity
          onPress={onGoBack}
          style={{
            position: 'absolute',
            left: 16,
            padding: 8,
          }}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 26,            
            fontFamily: FontFamilies.Gilroy.Heavy,
            marginTop: Platform.OS === 'ios' ? 50 : 45,
          }}>
            ←
          </Text>
        </TouchableOpacity>
      )}
      <Text
      numberOfLines={2}
      adjustsFontSizeToFit
      style={{
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FontFamilies.Gilroy.Heavy,
        textAlign: 'center',
        // paddingBottom: 6, // 5-7px spacing below title
        marginBottom: -50,
        lineHeight: 22,
      }}>
        {truncatedDisplayTitle}
      </Text>
    </View>
  );
};

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
          <NavigationContainer linking={linking}>
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
                animation: 'slide_from_right',
                animationDuration: 200,                
              }}>
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                  title: 'Movie Search',
                  headerTitleAlign: 'center',
                }}
              />
              <Stack.Screen
                name="MovieDetails"
                component={MovieDetailsScreen}
                options={({ navigation }) => ({
                  headerTitleAlign: 'center',
                  headerBackTitle: '',
                  headerBackTitleVisible: false,
                  header: () => (
                    <CustomHeader
                      title="Loading..r"
                      onGoBack={() => navigation.goBack()}
                    />
                  ),
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
