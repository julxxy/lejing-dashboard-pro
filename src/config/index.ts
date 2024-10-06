/**
 * Runtime configuration for the application.
 * @file Configuration file for the application.
 * @author Weasley
 */
type ENV = 'dev' | 'test' | 'prod'

const env: ENV = (document.documentElement.getAttribute('data-env') as ENV) || 'test'
const config = {
  dev: {
    mock: true,
    debug: true,
    baseURI: '/api',
    cdn: 'https://cdn-dev.example.com',
    apiUrl: 'http://localhost:3000',
    authUrl: 'http://localhost:3000/auth',
    uploadUrl: 'http://localhost:3000/upload',
    mockApiUrl: 'https://dev.example.com/mock',
  },
  test: {
    mock: false,
    debug: true,
    baseURI: '/api',
    cdn: 'https://cdn-test.example.com',
    apiUrl: 'https://test.example.com',
    authUrl: 'https://test.example.com/auth',
    uploadUrl: 'https://test.example.com/upload',
    mockApiUrl: 'https://test.example.com/mock',
  },
  prod: {
    mock: false,
    debug: false,
    baseURI: '/api',
    cdn: 'https://cdn-prod.example.com',
    apiUrl: 'https://www.example.com',
    authUrl: 'https://www.example.com/auth',
    uploadUrl: 'https://www.example.com/upload',
  },
}

// Export the configuration object.
export default {
  env,
  ...config[env],
}
