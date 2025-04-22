import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/AuthSlice';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
    
    // Cleanup errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [isLoggedIn, navigate, dispatch]);

  // Validate phone number using Vietnamese mobile format
  const validatePhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9][0-9]{8})$/;
    return regex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (VD: 0912345678)');
      return;
    } else {
      setPhoneError('');
    }
    
    dispatch(login({ phoneNumber, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Đăng Nhập</h1>
          <p className="text-gray-600 dark:text-gray-400">Chào mừng quay trở lại</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => dispatch(clearError())}
              >
                <span className="sr-only">Đóng</span>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Đóng</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input 
                id="phoneNumber"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              {phoneError && (
                <p className="mt-2 text-sm text-red-600">{phoneError}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mật khẩu
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Quên mật khẩu?
                </a>
              </div>
              <input 
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Đăng nhập'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa có tài khoản? 
              <button 
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 