import React from 'react';
import { Layout, Typography } from 'antd';
import './App.css';
import ToDoList from './components/ToDoList';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#2c3e50' }}>
      <Header>
        <Title level={2} style={{ color: '#c6d9eb', textAlign: 'center', margin: 0 }}>
          To-Do List
        </Title>
      </Header>
      <Content style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <ToDoList />
      </Content>
    </Layout>
  );
};

export default App;
///fdcgvjbhkml,;.
