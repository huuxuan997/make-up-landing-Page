import React, { useState } from 'react';

const SimpleShop = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome');

  console.log('SimpleShop component rendered');

  const handleClick = () => {
    console.log('Button clicked!');
    alert('Button works!');
  };

  const incrementCount = () => {
    console.log('Increment clicked');
    setCount(count + 1);
  };

  const goHome = () => {
    console.log('Going home');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '50px', background: '#f0f0f0' }}>
      <h1>Simple Shop Test</h1>
      <p>Count: {count}</p>
      <p>Message: {message}</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handleClick}
          style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Test Alert
        </button>
        
        <button 
          onClick={incrementCount}
          style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Count: {count}
        </button>
        
        <button 
          onClick={goHome}
          style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Go Home
        </button>
        
        <button 
          onClick={() => setMessage(`Time: ${new Date().toLocaleTimeString()}`)}
          style={{ padding: '10px 20px', background: 'orange', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Update Message
        </button>
      </div>
    </div>
  );
};

export default SimpleShop;
