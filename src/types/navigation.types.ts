import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Search: undefined;
  MovieDetails: { movieId: number };
};

export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
export type MovieDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
