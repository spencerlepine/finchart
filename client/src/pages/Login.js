import React from 'react';
import Layout from '../styles/Layout';
import { Container } from '@mui/system';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <Layout>
      <Container>
        <LoginForm />
      </Container>
    </Layout>
  );
};

export default Login;
