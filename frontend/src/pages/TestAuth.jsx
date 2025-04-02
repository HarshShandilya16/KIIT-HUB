import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Test component for debugging authentication issues
const TestAuth = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const testStandardAuth = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('https://kiithub-backend.vercel.app/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Test auth error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const testSimpleAuth = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('https://kiithub-backend.vercel.app/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Test simple auth error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const testCorsEndpoint = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('https://kiithub-backend.vercel.app/api/cors', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Test CORS error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Authentication Test Page</h1>
      <p>Use this page to test authentication endpoints directly</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testStandardAuth} 
          disabled={loading}
          style={{ padding: '10px', marginRight: '10px' }}
        >
          Test Standard Auth
        </button>
        
        <button 
          onClick={testSimpleAuth} 
          disabled={loading}
          style={{ padding: '10px', marginRight: '10px' }}
        >
          Test Simple Auth
        </button>
        
        <button 
          onClick={testCorsEndpoint} 
          disabled={loading}
          style={{ padding: '10px' }}
        >
          Test CORS Endpoint
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {result && (
        <div style={{ margin: '10px 0' }}>
          <h3>Result:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {result}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default TestAuth; 