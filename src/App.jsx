import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [isPremium, setIsPremium] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [telegramUser, setTelegramUser] = useState(null);
  const [botConnected, setBotConnected] = useState(false);
  const [child, setChild] = useState({
    name: 'Андрей',
    age: 2,
    streak: 7
  });

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    time: '19:00',
    frequency: 'daily',
    reminderType: 'motivational',
    botUsername: 'razvivayка_bot'
  });

  // Telegram Mini App integration
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // Получаем данные пользователя
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser(user);
        setChild(prev => ({
          ...prev,
          name: user.first_name || 'Малыш'
        }));
      }

      // Настраиваем внешний вид
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#f8fafc');
      tg.expand();
      
      // Обработчик кнопки "Назад"
      tg.onEvent('backButtonClicked', () => {
        if (currentScreen !== 'main') {
          setCurrentScreen('main');
          setSelectedActivity(null);
        }
      });

      // Показываем/скрываем кнопку "Назад"
      if (currentScreen !== 'main') {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentScreen]);

  // Функции для работы с Telegram Bot API
  const connectToBot = async () => {
    try {
      const response = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: telegramUser?.id,
          username: telegramUser?.username,
          firstName: telegramUser?.first_name,
          settings: notificationSettings
        })
      });

      if (response.ok) {
        setBotConnected(true);
        setNotificationSettings(prev => ({ ...prev, enabled: true }));
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert('Уведомления подключены! Теперь бот будет напоминать о занятиях.');
        }
      }
    } catch (error) {
      console.error('Ошибка подключения к боту:', error);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Ошибка подключения к боту. Попробуйте позже.');
      }
    }
  };

  const sendTestNotification = async () => {
    if (!botConnected) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Сначала подключитесь к боту!');
      }
      return;
    }

    try {
      const message = `🌟 Время для развития с ${child.name}! Сегодня изучаем что-то новое?`;
      
      const response = await fetch('/api/telegram/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: telegramUser?.id,
          message: message
        })
      });

      if (response.ok) {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert('Тестовое уведомление отправлено!');
        }
      }
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    }
  };

  const createTelegramPayment = async () => {
    if (!window.Telegram?.WebApp) {
      alert('Эта функция доступна только в Telegram');
      return;
    }

    setPaymentStatus('processing');
    
    try {
      const response = await fetch('/api/telegram/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: telegramUser?.id,
          amount: 299,
          description: 'Премиум подписка Развивайка'
        })
      });

      if (response.ok) {
        const { invoiceUrl } = await response.json();
        
        window.Telegram.WebApp.openInvoice(invoiceUrl, (status) => {
          if (status === 'paid') {
            setPaymentStatus('success');
            setIsPremium(true);
            setTimeout(() => {
              setShowPayment(false);
              setPaymentStatus('idle');
            }, 2000);
          } else {
            setPaymentStatus('error');
          }
        });
      }
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      setPaymentStatus('error');
    }
  };

  // Симуляция успешного платежа
  const simulatePaymentSuccess = () => {
    setPaymentStatus('success');
    setIsPremium(true);
    setTimeout(() => {
      setShowPayment(false);
      setPaymentStatus('idle');
    }, 2000);
  };

  const getAgeText = (age) => {
    if (age === 1) return 'год';
    if (age < 5) return 'года';
    return 'лет';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Главный экран */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Привет, {child.name}! 👋</h1>
            <p className="text-gray-600">Возраст: {child.age} {getAgeText(child.age)}</p>
            {telegramUser && (
              <p className="text-xs text-gray-500 mt-1">
                Telegram: @{telegramUser.username || telegramUser.first_name}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-orange-800">🏆 {child.streak} дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Подключение к боту */}
      {!botConnected && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center">🤖 Подключить уведомления</h3>
              <p className="text-sm opacity-90">Бот будет напоминать о занятиях в Telegram</p>
            </div>
            <button 
              onClick={connectToBot}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors"
            >
              Подключить
            </button>
          </div>
        </div>
      )}

      {/* Статус уведомлений */}
      {botConnected && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center">✅ Уведомления активны</h3>
              <p className="text-sm opacity-90">Следующее напоминание в {notificationSettings.time}</p>
            </div>
            <button 
              onClick={sendTestNotification}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors"
            >
              Тест
            </button>
          </div>
        </div>
      )}

      {/* Премиум подписка */}
      {!isPremium && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center">👑 Премиум подписка</h3>
              <p className="text-sm opacity-90">Открой все активности и возможности</p>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Подключить
            </button>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">▶️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Время для развития!</h2>
            <p className="text-gray-600">Выбери активность для {child.name}</p>
          </div>
          
          <button 
            onClick={() => alert('Активности скоро будут доступны!')}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-medium text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
          >
            Начать активность
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Активности</p>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">2.5ч</p>
                <p className="text-sm text-gray-600">Время развития</p>
              </div>
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => alert('Прогресс скоро будет доступен!')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-sm font-medium text-gray-800">Прогресс</p>
          </button>
          <button 
            onClick={() => alert('Библиотека скоро будет доступна!')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-sm font-medium text-gray-800">Библиотека</p>
          </button>
        </div>
      </div>

      {/* Модальное окно оплаты */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👑</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Премиум подписка</h2>
              <p className="text-gray-600 mb-6">Разблокируйте все возможности приложения</p>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Стоимость:</span>
                  <span className="text-2xl font-bold text-purple-600">299₽/мес</span>
                </div>
              </div>
              
              {paymentStatus === 'processing' && (
                <div className="mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Обработка платежа...</p>
                </div>
              )}
              
              {paymentStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-green-500 text-2xl mb-2">✓</div>
                  <p className="text-green-800 font-semibold">Платеж успешно завершен!</p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={createTelegramPayment}
                  disabled={paymentStatus === 'processing'}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  💳 Оплатить через Telegram
                </button>
                
                <button
                  onClick={simulatePaymentSuccess}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Симулировать успешный платеж (для теста)
                </button>
                
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
