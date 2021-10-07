import React, { useState, useEffect } from "react";
import Stars from 'react-native-stars';
import { ScrollView, Modal } from "react-native";

import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather, Ionicons } from '@expo/vector-icons';

import Genres from '../../components/Genres';
import ModalLink from '../../components/ModalLink';
import api, { key } from '../../services/api';

import { deleteMovie, saveMovie, hasMovie } from '../../utils/storage';

import {
  Container,
  Header,
  HeaderButton,
  Banner,
  ButtonLink,
  Title,
  ContentArea,
  Rate,
  ListGenres,
  Description
} from './style';

export default function Detail() {

  const navigation = useNavigation();
  const route = useRoute();

  const [movie, setMovie] = useState({});
  const [openLink, setOpenLink] = useState(false);
  const [favoritedMovie, setFavoritedMovie] = useState(false);

  useEffect(() => {
    let isActive = true;
    async function getMovie() {
      try {
        const params = {
          'api_key': key,
          language: 'pt-br'
        };
        const { data } = await api.get(`/movie/${route.params?.id}`, { params });

        setMovie(data);
        setFavoritedMovie(await hasMovie('@primereact', data));
      } catch (err) {
        console.error(err);
      }
    }
    if (isActive) {
      getMovie();
    }

    return () => {
      isActive = false;
    }

  }, []);

  async function handleFavoriteMovie(movie) {
    if (favoritedMovie) {
      await deleteMovie('@primereact', movie.id);
      setFavoritedMovie(false);
      return;
    }
    await saveMovie('@primereact', movie);
    setFavoritedMovie(true);
  }

  return (
    <Container>
      <Header>
        <HeaderButton activeOpacity={0.7} onPress={() => navigation.goBack()} >
          <Feather
            name='arrow-left'
            size={28}
            color='#FFF'
          />
        </HeaderButton>
        <HeaderButton onPress={() => handleFavoriteMovie(movie)}>
          { favoritedMovie? (
            <Ionicons
            name='bookmark'
            size={28}
            color='#FFF'
          />
          ): (
            <Ionicons
            name='bookmark-outline'
            size={28}
            color='#FFF'
          />
          )}
        </HeaderButton>
      </Header>

      <Banner
        resizeMethod='resize'
        source={{ uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`}}
      />

      <ButtonLink activeOpacity={0.7} onPress={() => setOpenLink(true)}>
        <Feather name='link' size={24} color='#FFF' />
      </ButtonLink>

      <Title numberOfLines={2} >{movie.title}</Title>

      <ContentArea disable={true}>
        <Stars 
          default={movie.vote_average}
          count={10}
          half={true}
          starSize={20}
          fullStar={ <Ionicons name='md-star' size={24} color='#E7A74e' /> }
          emptyStar={ <Ionicons name='md-star-outline' size={24} color='#E7A74e' /> }
          halfStar={ <Ionicons name='md-star-half' size={24} color='#E7A74e' /> }
          disable={true}
        />
        <Rate>{movie.vote_average}/10</Rate>
      </ContentArea>

      <ListGenres
        data={movie?.genres}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Genres data={item} />}
      />

      <ScrollView showsVerticalScrollIndicator={false} >
        <Title>Descrição</Title>
        <Description>{movie.overview}</Description>
      </ScrollView>

      <Modal animationType='slide' transparent={true} visible={openLink} >
        <ModalLink link={movie?.homepage} title={movie?.title} closeModal={() => setOpenLink(false)} />
      </Modal>
    </Container>
  );
};