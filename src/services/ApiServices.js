// apiServices.js
import { MANAGER_LOGIN_URL } from './ApiUrls';

export const useManagerAuth = async (username, password, loginCallback, errorCallback, navigate) => {
  try {
    const response = await fetch(MANAGER_LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({
        manager_email: username,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const data = await response.json();

    if (data[0].Message.response === 'error') {
      console.log(data[0].Message.response);
      errorCallback("Please Check Your Credentials");
    } else {
      const manager = {
        username: data[0].Message.manager_name,
        email: data[0].Message.manager_email,
        mobile: data[0].Message.manager_mobile,
      };

      loginCallback(manager);
      navigate('/dashboard'); // Navigate after successful login
    }
  } catch (error) {
    console.error('Error:', error);
    errorCallback("An error occurred while processing your request. Please try again later.");
  }
};
