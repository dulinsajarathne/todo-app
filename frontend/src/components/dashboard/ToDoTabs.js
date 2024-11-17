// ToDoTabs.js
import React from 'react';
import { Tabs, List, Button, Space } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ToDoItems from './ToDoItems';

const ToDoTabs = ({ tasks, onEdit, onDelete, onMarkAsCompleted, sortCriteria, setSortCriteria, sortOrder, setSortOrder, sortTasks }) => {
    const filteredToDoTasks = tasks.filter(task => !task.completed);
    const filteredCompletedTasks = tasks.filter(task => task.completed);
    
    const tabItems = [
        {
            key: '1',
            label: 'To Do',
            children: (
                <>
                    <Space style={{ marginBottom: '10px' }}>
                        <Button onClick={() => setSortCriteria('date')}>
                            Sort by Date
                            {sortCriteria === 'date' ? (sortOrder === 'asc' ? <UpOutlined /> : <DownOutlined />) : null}
                        </Button>
                        <Button onClick={() => setSortCriteria('enteredDate')}>
                            Sort by Entered Date
                            {sortCriteria === 'enteredDate' ? (sortOrder === 'asc' ? <UpOutlined /> : <DownOutlined />) : null}
                        </Button>
                        <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                            {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                        </Button>
                    </Space>

                    <List
                        dataSource={sortTasks(filteredToDoTasks, sortCriteria, sortOrder)}
                        renderItem={(task) => (
                            <ToDoItems
                                task={task}
                                isCompleted={false}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onMarkAsCompleted={onMarkAsCompleted}
                            />
                        )}
                    />
                </>
            ),
        },
        {
            key: '2',
            label: 'Completed',
            children: (
                <List
                    dataSource={sortTasks(filteredCompletedTasks, sortCriteria, sortOrder)}
                    renderItem={(task) => (
                        <ToDoItems
                            task={task}
                            isCompleted={true}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    )}
                />
            ),
        },
    ];

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default ToDoTabs;
