import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedState, setSelectedState] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesEndRef = useRef(null);

  const ticketPrice = 250;

  const translations = {
    en: {
      greeting: 'Hello! Welcome to the Museum Ticket Booking System. Please select your state from the dropdown.',
      askTickets: 'How many tickets would you like to purchase? (Enter a number between 1 and 100)',
      invalidTickets: 'Please enter a valid number of tickets between 1 and 100.',
      selectedTickets: 'You selected {tickets} tickets. The total cost is ₹{totalCost}. Would you like to confirm your booking? (yes/no)',
      confirmBooking: 'Please respond with "yes" or "no" to confirm your booking.',
      bookingCanceled: 'Booking canceled. If you would like to start again, please enter the number of tickets you want to book.',
      paymentOptions: 'Please choose your payment method for ₹{totalCost}:',
      paymentSuccess: 'Payment Successful using {method}. Thank you!',
      selectState: 'You have selected {state}. Now, how many tickets would you like to purchase? (Enter a number between 1 and 100)',
    },
  };

  useEffect(() => {
    setTimeout(() => addMessage('bot', getTranslation('greeting')), 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage('user', userInput);
      processMessage(userInput);
      setUserInput('');
    }
  };

  const processMessage = (message) => {
    setShowTypingIndicator(true);
    setTimeout(() => {
      setShowTypingIndicator(false);
      if (bookingStep === 0) {
        const numberOfTickets = parseInt(message, 10);
        if (isNaN(numberOfTickets) || numberOfTickets < 1 || numberOfTickets > 100) {
          addMessage('bot', getTranslation('invalidTickets'));
        } else {
          setSelectedTickets(numberOfTickets);
          const totalCost = numberOfTickets * ticketPrice;
          addMessage('bot', getTranslation('selectedTickets').replace('{tickets}', numberOfTickets).replace('{totalCost}', totalCost));
          setBookingStep(1);
        }
      } else if (bookingStep === 1) {
        const response = message.toLowerCase();
        if (response === 'yes') {
          addMessage('bot', getTranslation('paymentOptions').replace('{totalCost}', selectedTickets * ticketPrice));
          showPaymentOptions();
          setBookingStep(2);
        } else if (response === 'no') {
          addMessage('bot', getTranslation('bookingCanceled'));
          setBookingStep(0);
        } else {
          addMessage('bot', getTranslation('confirmBooking'));
        }
      }
    }, 1500);
  };

  const showPaymentOptions = () => {
    const paymentOptions = (
      <div className="flex space-x-2">
        <button onClick={() => processPayment('UPI')} className="bg-blue-500 text-white px-3 py-1 rounded">UPI</button>
        <button onClick={() => processPayment('Debit Card')} className="bg-blue-500 text-white px-3 py-1 rounded">Debit Card</button>
        <button onClick={() => processPayment('Credit Card')} className="bg-blue-500 text-white px-3 py-1 rounded">Credit Card</button>
        <button onClick={() => processPayment('Others')} className="bg-blue-500 text-white px-3 py-1 rounded">Others</button>
      </div>
    );
    addMessage('bot', paymentOptions);
  };

  const processPayment = (method) => {
    setShowTypingIndicator(true);
    setTimeout(() => {
      setShowTypingIndicator(false);
      addMessage('bot', getTranslation('paymentSuccess').replace('{method}', method));
      setBookingStep(0);
    }, 1500);
  };

  const getTranslation = (key) => {
    return translations[selectedLanguage][key];
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('museum.jpg')"}}>
      <div className="w-full max-w-md bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg">
        <header className="bg-blue-500 text-white p-4 text-center rounded-lg mb-4">
          <h1 className="text-2xl font-bold">Museum Ticket Booking System (₹)</h1>
        </header>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setSelectedState(e.target.value)}
          value={selectedState}
        >
            <option value="" disabled>Select your state</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
        </select>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setSelectedLanguage(e.target.value)}
          value={selectedLanguage}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
        <div className="bg-gray-200 p-4 rounded-lg h-80 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                {msg.message}
              </span>
            </div>
          ))}
          {showTypingIndicator && (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
