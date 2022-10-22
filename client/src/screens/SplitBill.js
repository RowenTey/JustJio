import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { AxiosContext } from '../context/axios';
import { useForm } from 'react-hook-form';
import Spinner from '../components/Spinner';
import CustomInput from '../components/CustomInput';

var billData = {
  billname: '',
  amount: '',
};

const initialState = {
  ...billData,
};

const SplitBill = ({ navigation, route }) => {
  const { roomName } = route.params;
  var a = ["3", "6", "7", "8"];
  var people = 0;
  for(var i=0; i< a.length; i++)
  {
    people++;
  }
  
  var eachAmount = 0;
  var billAmount = 0;

  const calcAmountToPay = () => {
    billAmount = billData.amount;
    eachAmount = billAmount / people;
    eachAmount = eachAmount.toFixed(2);
    console.log("Total amount each person pays "+eachAmount);
    //need to send to the Home Page and update the new amount to pay


  }; //need to work on this after today's commit

  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm({ initialState });

  const { authAxios } = useContext(AxiosContext);
  const [loading, setLoading] = useState(false);

  const onSplitBill = async formData => {
    setLoading(true);
    let { billname, amount } = formData;

    billData = {
      billname,
      amount,
    };

    try {
      console.log('Split Bill Data', billData);
      calcAmountToPay();
      const response = await authAxios.post('/bills', billData);
      console.log('Split Bill Successfully', response.data);
      setLoading(false);
      onSplitBillSuccess();
    } catch (error) {
      setLoading(false);
      console.log('Failed to create bill', error);
      if (error.response) {
        console.log('Error response', error.response.data);
      } else if (error.request) {
        console.log('Error request', error.request);
      }
    }
  };

  const onSplitBillSuccess = () => {
    navigation.navigate('HomeTab');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.containerMain}>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.back}
            source={require('../../assets/images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Split Bill</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.billTopText}>Bill for: {room.name} </Text>
        <View style={styles.topLineStyle} />

        <Text style={styles.billText}>Bill name: </Text>
        <CustomInput
          placeholder={''}
          placeholderTextColor="#4E1164"
          name="billName"
          rules={{ required: 'Bill name is required' }}
          control={control}
          textStyles={styles.input}
        />

        <Text style={styles.billText}>Amount to split: </Text>
        <CustomInput
          placeholder={''}
          placeholderTextColor="#4E1164"
          name="amount"
          rules={{ required: 'Amount is required' }}
          control={control}
          textStyles={styles.input}
        />
        <View style={styles.confirm}>
          <TouchableOpacity onPress={handleSubmit(onSplitBill)}>
            <Text style={styles.buttonText}>Split Bill</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SplitBill;

const styles = StyleSheet.create({
  title: {
    //top of the content
    backgroundColor: '#E9D7FD',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    height: 80,
    flexDirection: 'row',
  },

  middle: {
    //move the whitebox to center and top of screen
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0ecec',
    width: 350,
    height: 250,
    bottom: -10,
  },

  containerMain: {
    //the background colour of the entire application
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
    height: '100%',
  },

  header: {
    //text details of the page header text
    fontSize: 25,
    top: 8,
    fontFamily: 'Poppins-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4E1164',
  },

  back: {
    // back arrow
    position: 'absolute',
    top: -1,
    right: 90,
  },

  billText: {
    //text details of the text
    fontSize: 20,
    top: 10,
    fontFamily: 'Poppins',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4E1164',
    marginLeft: 45,
    marginVertical: 8,
  },

  input: {
    left: 45,
  },

  billTopText: {
    //text details of the text
    fontSize: 15,
    fontFamily: 'Poppins',
    color: '#4E1164',
    marginLeft: 12,
  },

  topLineStyle: {
    borderWidth: 1,
    borderColor: '#4E1164',
    marginVertical: 10,
    width: 500,
  },

  lineStyle: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    marginLeft: 45,
    width: 300,
    alignSelf: 'center',
  },

  qrcode: {
    // qr code placement?
    position: 'absolute',
    right: 35,
    top: 10,
    height: 50,
    width: 50,
  },

  gap: {
    //between the bill name,drinks and amount to split:,$50.00
    marginVertical: 2,
  },

  room: {
    position: 'absolute',
    left: 70,
    top: 30,
    height: 49,
    width: 16,
  },

  confirm: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '45%',
    minHeight: '9%',
    maxHeight: '9%',
    position: 'relative',
    top: 25,
    backgroundColor: '#4E1164',
    borderRadius: 10,
    left: 23,
  },

  buttonText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    margin: 15,
  },
});
