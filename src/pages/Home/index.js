import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  SearchContainer,
  Input,
  SearchButton,
  Title,
  BannerButton,
  Banner,
  SliderMovie
} from './style';

import Header from "../../components/Header";
import SliderItem from "../../components/SliderItem";

import api, { key } from '../../services/api';

import { getListMovies, randomBanner } from '../../utils/movie';

export default function Home() {

  const [nowMovies, setNowMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [bannerMovie, setBannerMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    let isActive = true;
    const ac = new AbortController();

    async function getMovies() {
      const params = {
        'api_key': key,
        language: 'pt-br',
        page: 1
      };
      const [nowData, popularData, topData] = await Promise.all([
        await api.get('/movie/now_playing', { params }),
        await api.get('/movie/popular', { params }),
        await api.get('/movie/top_rated', { params }),
      ]);
      if (isActive) {
        setBannerMovie(randomBanner(nowData.data.results));
        setNowMovies(getListMovies(10, nowData.data.results));
        setPopularMovies(getListMovies(10, popularData.data.results));
        setTopMovies(getListMovies(10, topData.data.results));
        setLoading(false);
      }
    }
    getMovies();

    return () => {
      isActive = false;
      ac.abort();
    }
  }, []);

  function navigateDetailsPage(item) {
    navigation.navigate('Detail', { id: item.id });
  };
  
  function handleSearchMovie() {
    if (input === '') return;
    navigation.navigate('Search', { name: input });
    setInput('');
  }

  if (loading) return (
    <Container>
      <ActivityIndicator size='large' color='#FFF' />
    </Container>
  )

  return (
    <Container>
      <Header title='React Prime' />
      <SearchContainer>
        <Input
          placeholder='Ex Vingadores'
          placeholderTextColor='#ddd'
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <SearchButton onPress={ handleSearchMovie }>
          <Feather name='search' size={30} color='#FFF' />
        </SearchButton>
      </SearchContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Em cartaz</Title>
        <BannerButton activeOpacity={0.9} onPress={() => navigateDetailsPage(bannerMovie)}>
          <Banner
            resizeMethod='resize'
            source={{ uri: `https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}` }}
          />
        </BannerButton>
        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={nowMovies}
          renderItem={({ item }) => <SliderItem data={item} navigatePage={() => navigateDetailsPage(item)} />}
          keyExtractor={(item) => String(item.id)}
        />

        <Title>Populares</Title>
        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={popularMovies}
          renderItem={({ item }) => <SliderItem data={item} navigatePage={() => navigateDetailsPage(item)} />}
          keyExtractor={(item) => String(item.id)}
        />

        <Title>Mais votados</Title>
        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={topMovies}
          renderItem={({ item }) => <SliderItem data={item} navigatePage={() => navigateDetailsPage(item)} />}
          keyExtractor={(item) => String(item.id)}
        />
      </ScrollView>
    </Container>
  );
};