import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getStorage = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return JSON.parse(jsonValue || '');
  } catch (e) {
    // error reading value
  }
};

export const removeStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }

  console.log('Done.');
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('clearStorage');
};
