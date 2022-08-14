import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { authActions } from './redux/auth/auth.slice';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './styles/index.scss';
import { setupAuthInterceptor } from './redux/auth/interceptor';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'antd/dist/antd.less';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500,
    },
  },
});

setupAuthInterceptor(store);

function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
store
  .dispatch(authActions.initState())
  .catch(() => store.dispatch(authActions.logout()))
  .then(renderApp);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
