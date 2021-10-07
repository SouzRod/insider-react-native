import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Container, Banner, Title, RateContainer, Rate } from './style';

export default function SearchItem({ data }) {
  const navigation = useNavigation();

  function navigateDetailsPage(item) {
    if (item.release_date === '') return;
    navigation.navigate('Detail', { id: item.id });
  };

  return (
      <Container activeOpacity={0.7} onPress={() => navigateDetailsPage(data)}>
        { data?.backdrop_path ? (
          <Banner
            resizeMethod='resize'
            source={{ uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}` }}
          />
        ):(
          <Banner
            resizeMethod='resize'
            source={require('../../assets/semfoto.png')}
          />
        )}

        <Title>{data.title}</Title>
        <RateContainer>
          <Ionicons name='md-star' size={12} color='#E7A74e' />
          <Rate>{data.vote_average}/10</Rate>
        </RateContainer>
      </Container>
  );
}