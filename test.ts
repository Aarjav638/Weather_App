// Function to fetch weather details for each city from the API
// // const fetchCityWeatherDetailsFromAPI = async (
// //   city: string,
// //   state: string,
// //   country: string,
// // ) => {
// //   try {
// //     const weather_response = await axios.post(
// //       'https://cjxiaojia.com/api/location',
// //       {
// //         city,
// //         state,
// //         country,
// //       },
// //     );
// //     // console.log(weather_response.data[0].hourly);
// //     return weather_response.data[0].hourly;
// //   } catch (error) {
// //     console.error('Error fetching weather details from API:', error);
// //     return null;
// //   }
// // };

// // // const weather_response = fetchCityWeatherDetailsFromAPI(
// // //   cityname[0].cityName,
// // //   cityname[0].state,
// // //   cityname[0].country,
// // // );

// // // console.log(weather_response);
// // // Sync data with the API when online
// // const syncCityWeatherData = async (CityDetails: CityDetails[]) => {
// //   try {
// //     const citiesWithUpdatedWeather = await Promise.all(
// //       CityDetails.map(async city => {
// //         const weatherData = await fetchCityWeatherDetailsFromAPI(
// //           city.city?.cityName,
// //           city.city?.state,
// //           city.city?.country,
// //         );

// //         if (weatherData) {
// //           const currentHour = new Date().getHours();
// //           const weatherTimeArray = weatherData.time.map(
// //             (timeString: string) => new Date(timeString).getHours(),
// //           );
// //           const currentHourIndex = weatherTimeArray.indexOf(currentHour);
// //           const currentTemperature =
// //             currentHourIndex !== -1
// //               ? weatherData.temperature_2m[currentHourIndex]
// //               : city.temperature;

// //           // Update the local database with new weather data
// //           await updateCityDetails(db, {
// //             temperature: currentTemperature,
// //             airQuality: '71',
// //             cityId: city.cityId,
// //             date: new Date(),
// //             weatherDetails: JSON.stringify(weatherData),
// //           });
// //           city.temperature = currentTemperature; // Update the temperature in the UI
// //         } else {
// //           // No weather data available from API, fall back to existing database data
// //           console.log(`No updated weather data for ${city.city?.cityName}`);
// //         }
// //         return city;
// //       }),
// //     );

// //     setCityname(citiesWithUpdatedWeather);
// //   } catch (error) {
// //     console.error('Error syncing city weather data:', error);
// //   }
// // };

// // const addCityDetails_Table = async (cityNames: CityDetails[]) => {
// //   try {
// //     const citiesWithUpdatedWeather = await Promise.all(
// //       cityNames.map(async city => {
// //         const weatherData = await fetchCityWeatherDetailsFromAPI(
// //           city.city?.cityName,
// //           city.city?.state,
// //           city.city?.country,
// //         );

// //         if (weatherData) {
// //           const currentHour = new Date().getHours();
// //           const weatherTimeArray = weatherData.time.map(
// //             (timeString: string) => new Date(timeString).getHours(),
// //           );
// //           const currentHourIndex = weatherTimeArray.indexOf(currentHour);
// //           const currentTemperature =
// //             currentHourIndex !== -1
// //               ? weatherData.temperature_2m[currentHourIndex]
// //               : city.temperature;

// //           // Update the local database with new weather data
// //           await addCityDetails(db, {
// //             temperature: currentTemperature,
// //             airQuality: '71',
// //             cityId: city.id,
// //             date: new Date(),
// //             weatherDetails: JSON.stringify(weatherData),
// //           });
// //           city.temperature = currentTemperature; // Update the temperature in the UI
// //         } else {
// //           // No weather data available from API, fall back to existing database data
// //           console.log(`No updated weather data for ${city.cityId}`);
// //         }
// //         return city;
// //       }),
// //     );

// //     setCityname(citiesWithUpdatedWeather);
// //   } catch (error) {
// //     console.error('Error syncing city weather data:', error);
// //   }
// // };

// // // Function to fetch city details either from the API or local database
// // const fetchCityDetails = useCallback(async () => {
// //   try {
// //     const cityNames = await getCityName(db);
// //     console.log(cityNames);

// //     if (cityNames) {
// //       setCityname(cityNames);
// //       if (isConnected) {
// //         await syncCityWeatherData(cityNames); // Sync and update data when online
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Error fetching city details:', error);
// //   }
// // }, [isConnected]);

// useFocusEffect(
//   useCallback(() => {
//     fetchCityDetails();
//   }, [fetchCityDetails]),
// );

// // Function to handle the selection of a city from the search results
// const handleCitySelection = async (
//   city: string,
//   state: string,
//   country: string,
// ) => {
//   try {
//     await addCityname(db, {cityName: city, state: state, country: country});
//     setModalVisible(false);
//     fetchCityDetails();
//   } catch (err) {
//     console.error('Error inserting city:', err);
//     setModalVisible(false);
//   }
// };
