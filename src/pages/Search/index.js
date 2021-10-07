import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from '@react-navigation/native'

import api, { key } from '../../services/api';

import SearchItem from "../../components/SearchItem";

import { Container, ListMovies } from './style'; 

export default function Search() {
  const navigation = useNavigation();
  const route = useRoute();

  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function getSearchMovie() {
      try {
        const params = {
          'api_key': key,
          language: 'pt-br',
          page: 1,
          query: route?.params?.name
        };
        const { data } = await api.get(`/search/movie`, { params });

        setMovie(data.results);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (isActive) {
      getSearchMovie();
    }

    return () => {
      isActive = false
    }
  }, []);

  if (loading) {
    return (
      <Container></Container>
    );
  }

  return (
    <Container>
      <ListMovies 
        data={movie}
        showVerticalSrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <SearchItem data={item} /> }
      />
    </Container>
  );
};