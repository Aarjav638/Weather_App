import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import axios from 'axios';

const Notifications = () => {
  const sendNotification = async () => {
    const url = 'https://api.onesignal.com/notifications';

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic YWQ5N2YxNmEtN2JiYS00NjMxLTlkYmMtYWU0ZTgyZWI5OTc5',
    };

    const body = {
      app_id: '1dcf5e4a-91d3-4365-970f-40111d84c5c8',
      contents: {en: 'English Message'},
      included_segments: ['Active Users', 'Inactive Users'],
    };

    try {
      const response = await axios.post(url, body, {headers});
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendNotification();
    }, 5000); // 5000 ms = 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <Text style={{color: '#fff'}}>Notifications</Text>
    </View>
  );
};

export default Notifications;
