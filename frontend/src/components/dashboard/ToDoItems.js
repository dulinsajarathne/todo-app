import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ToDoForm.css';

const { Title, Text } = Typography;

const ToDoItems = ({ task, isCompleted, onEdit, onDelete, onMarkAsCompleted }) => {
    const isToday = (date) => moment(date).isSame(moment(), 'day');

    return (
        <Card
            className={`task-card ${isToday(task.dueDate) ? 'highlight' : ''}`}
            key={task.id}
            style={{ marginBottom: '10px' }}
            styles={{ body: { padding: '8px' } }}  // Updated to use styles.body
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 2 }}>
                    <Title level={5} style={{ margin: 0, fontSize: '14px', lineHeight: '1.2' }}>{task.title}</Title>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#595959' }}>
                        {task.description || 'No description'}
                    </Text>
                    <br />
                    <Text className="date-text" style={{ margin: '0 0 0 8px', fontSize: '12px', color: '#8c8c8c' }}>
                        {isCompleted ? `Completed on: ${task.date}` : `Due: ${task.dueDate}`}
                    </Text>
                </div>
                <Space size="small">
                    {!isCompleted && (
                        <Button type="text" icon={<CheckOutlined />} onClick={() => onMarkAsCompleted(task.id)} />
                    )}
                    <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)} />
                </Space>
            </div>
        </Card>
    );
};

export default ToDoItems;
