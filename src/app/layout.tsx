"use client"
import Header from './components/Header'
import './globals.css'
import { Mulish } from 'next/font/google';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import Swal from 'sweetalert2';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';


const mulish = Mulish({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const authLink = setContext(async (_, { headers }) => {
  // const token = localStorage.getItem('accessToken');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhZGlAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjg2NzIyNDM2fQ.XxumUI2qQZlxy6VMRptAlCwej_y33NnRE-ZknMBJsP0';
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // notification toast
  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  return (
    <html lang="en">
      <body className={mulish.className}>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <Header />
            {children}
          </Provider>
        </ApolloProvider>
      </body>
    </html>
  )
}
