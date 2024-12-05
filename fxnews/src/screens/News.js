import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';

const NewsScreen = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNewsData = async () => {
    try {
      const response = await axios.get(
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=M4LIT9N2EPB2OKYU'
      );
      const articles = response.data.feed || [];
      return articles.map((article, index) => ({
        id: `news-${index}`,
        title: article.title,
        description: article.summary || 'No description available',
        publishedAt: article.time_published,
        url: article.url,
        imageUrl: article.banner_image,
      }));
    } catch (error) {
      console.error('Error fetching news data:', error);
      setError('Failed to load news from Alpha Vantage.');
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const primaryData = await fetchNewsData();
      setNewsData(primaryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while loading news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => Linking.openURL(item.url)}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.publishedAt}>
          Published Date: {new Date(item.publishedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredData = newsData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        <ActivityIndicator size="large" color="#2E415E" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },
  list: {
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: '#2E415E',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  publishedAt: {
    fontSize: 12,
    color: '#888',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default NewsScreen;
