import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AuthContext } from '../context/auth';
import { AxiosContext } from '../context/axios';
import * as KeyChain from 'react-native-keychain';
import Spinner from '../components/Spinner';
import CustomInput from '../components/CustomInput';

const initialState = {
  username: '',
  password: '',
};

const Signin = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm({ defaultValues: initialState });
  const authContext = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);
  const [loading, setLoading] = useState(false);

  // function for backend to check if data is right then approve :)
  const onLogin = async formData => {
    // console.warn('Signing in');
    setLoading(true);
    try {
      console.log('Login data', formData);
      const response = await publicAxios.post('/auth', formData);
      console.log('Response status', response.status);
      const { token } = response.data;
      authContext.setAuthState({
        accessToken: token,
        authenticated: true,
      });

      await KeyChain.setGenericPassword(
        'token',
        JSON.stringify({
          token,
        }),
      );

      console.log('Logged in', response.data);
      setLoading(false);
      navigation.navigate('HomeTab');
    } catch (error) {
      setLoading(false);
      console.log('Login failed', error);
      if (error.response) {
        console.log('Error response', error.response.data);
      } else if (error.request) {
        console.log('Error request', error.request);
      }
    }
  };

  const onSignup = () => {
    // console.warn('Signup page');
    navigation.navigate('Signup');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.text}>JustJio</TextInput>

      <CustomInput
        placeholder={'Enter your username'}
        placeholderTextColor="#4E1164"
        name="username"
        rules={{ required: 'Username is required' }}
        control={control}
        textStyles={styles.inputText}
      />
      <CustomInput
        placeholder={'Enter your password'}
        placeholderTextColor="#4E1164"
        name="password"
        rules={{ required: 'Password is required' }}
        control={control}
        secureTextEntry={true}
        textStyles={styles.inputText}
      />

      <TouchableOpacity>
        <Text style={styles.confirmationBox} onPress={handleSubmit(onLogin)}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.miniBold}>Forgot password</Text>
      </TouchableOpacity>

      <View style={styles.smallText}>
        <Text style={styles.signup}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signupLink} onPress={onSignup}>
            {' '}
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9D7FD',
  },

  header: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9D7FD',
  },

  head: {
    backgroundColor: '#E9D7FD',
  },

  text: {
    fontSize: 56,
    top: -40,
    fontFamily: 'OleoScript-Bold',
    color: '#4E1164',
  },

  smallText: {
    fontSize: 13,
    color: '#4E1164',
    flexDirection: 'row',
    bottom: -110,
  },

  inputText: {
    color: '#6C6C6B',
    fontFamily: 'Poppins',
    fontSize: 13,
  },

  confirmationBox: {
    borderRadius: 25,
    width: 300,
    height: 40,
    paddingVertical: 10,
    backgroundColor: '#4E1164',
    marginVertical: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
    alignItems: 'center',
    textAlign: 'center',
    bottom: -90,
  },

  signup: {
    color: '#4E1164',
    fontsize: 16,
    fontweight: '500',
  },

  signupLink: {
    color: '#4E1164',
    fontsize: 16,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },

  miniBold: {
    fontSize: 13,
    color: '#4E1164',
    flexDirection: 'row',
    fontWeight: 'bold',
    bottom: -100,
  },
});