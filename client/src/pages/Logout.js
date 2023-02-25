import React, { useEffect } from 'react';
import Layout from '../styles/Layout';
import { Container } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        navigate('/login');
      });
  }, [navigate]);

  return (
    <Layout>
      <Container></Container>
    </Layout>
  );
};

export default Logout;
