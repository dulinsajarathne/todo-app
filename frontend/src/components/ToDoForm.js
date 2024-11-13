import React, { useState } from 'react';
import { Input, Button, Tabs, List, Typography, Card, Space, DatePicker, message } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, EditOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ToDoForm.css';

const { Title, Text } = Typography;

const ToDoForm = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDate, setTaskDate] = useState(null); // Default null, will hold both date and time
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null); // For editing a task
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
    const [sortCriteria, setSortCriteria] = useState('date'); // Default sorting by date

    // Add a new task
    const addTask = () => {
        if (taskTitle && taskDate) { // Only title and date-time are required
            const newTask = {
                title: taskTitle,
                description: taskDescription || '', // If no description, use empty string
                date: taskDate.format('YYYY-MM-DD HH:mm'), // Save both date and time
                enteredDate: Date.now(), // Store the entered date
                id: Date.now(),
            };
            setTasks([...tasks, newTask]);
            setTaskTitle('');
            setTaskDescription('');
            setTaskDate(null);
        } else {
            message.error('Please fill out the title and date/time');
        }
    };

    // Edit a task
    const editTask = (task) => {
        setEditingTask(task);
        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskDate(moment(task.date, 'YYYY-MM-DD HH:mm')); // Parse the date-time properly
    };

    // Update an existing task
    const updateTask = () => {
        if (taskTitle && taskDate) { // Only title and date-time are required
            const updatedTask = {
                ...editingTask,
                title: taskTitle,
                description: taskDescription || '', // If no description, use empty string
                date: taskDate.format('YYYY-MM-DD HH:mm'),
            };
            setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)));
            setEditingTask(null);
            setTaskTitle('');
            setTaskDescription('');
            setTaskDate(null);
        } else {
            message.error('Please fill out the title and date/time');
        }
    };

    // Mark task as completed
    const markAsCompleted = (id) => {
        const task = tasks.find((t) => t.id === id);
        const completedTask = {
            ...task,
            completedDate: moment().format('YYYY-MM-DD HH:mm'), // Store the current date and time
        };
        setTasks(tasks.filter((t) => t.id !== id));
        setCompletedTasks([...completedTasks, completedTask]);
    };

    // Delete a task
    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
        setCompletedTasks(completedTasks.filter((t) => t.id !== id));
    };

    // Sort tasks based on criteria and order
    const sortTasks = (tasks, criteria, order) => {
        return tasks.sort((a, b) => {
            let compareA, compareB;
            switch (criteria) {
                case 'date':
                    compareA = moment(a.date, 'YYYY-MM-DD HH:mm');
                    compareB = moment(b.date, 'YYYY-MM-DD HH:mm');
                    break;
                case 'enteredDate':
                    compareA = a.enteredDate;
                    compareB = b.enteredDate;
                    break;
                default:
                    return 0;
            }

            if (compareA < compareB) return order === 'asc' ? -1 : 1;
            if (compareA > compareB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Highlight today's tasks
    const isToday = (date) => {
        return moment(date).isSame(moment(), 'day');
    };

    // Define tabs using the `items` prop instead of `TabPane`
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
                        dataSource={sortTasks(tasks, sortCriteria, sortOrder)}
                        renderItem={(task) => (
                            <Card
                                className={`task-card ${isToday(task.date) ? 'highlight' : ''}`}
                                key={task.id}
                                style={{ marginBottom: '10px' }}
                                bodyStyle={{ padding: '8px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 2 }}>
                                        <Title level={5} style={{ margin: 0, fontSize: '14px', lineHeight: '1.2' }}>{task.title}</Title>
                                        <Text style={{ margin: 0, fontSize: '12px', color: '#595959' }}>
                                            {task.description || 'No description'}
                                        </Text>
                                        <br />
                                        <Text className="date-text" style={{ margin: '0 0 0 8px', fontSize: '12px', color: '#8c8c8c' }}>
                                            Due: {task.date}
                                        </Text>
                                    </div>
                                    <Space size="small">
                                        <Button type="text" icon={<CheckOutlined />} onClick={() => markAsCompleted(task.id)} />
                                        <Button type="text" icon={<EditOutlined />} onClick={() => editTask(task)} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} />
                                    </Space>
                                </div>
                            </Card>


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
                    dataSource={sortTasks(completedTasks, sortCriteria, sortOrder)}
                    renderItem={(task) => (
                        <Card
  className="task-card"
  key={task.id}
  style={{ marginBottom: '10px' }}
  bodyStyle={{ padding: '8px' }}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <Title level={5} style={{ margin: 0, fontSize: '14px', lineHeight: '1.2' }}>{task.title}</Title>
      <Text style={{ margin: 0, fontSize: '12px', color: '#595959' }}>
        {task.description || 'No description'}
      </Text>
      <br />
      <Text className="date-text" style={{ margin: '0 0 0 8px', fontSize: '12px', color: '#8c8c8c' }}>
        Completed on: {task.date}
      </Text>
    </div>
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      onClick={() => deleteTask(task.id)}
    />
  </div>
</Card>

                    )}
                />
            ),
        },
    ];

    return (
        <div style={{ width: '600px', margin: '0 auto' }}>
            <Card className="todo-form-box">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                        placeholder="Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <Input
                        placeholder="Description (optional)"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <DatePicker
                        placeholder="Select date and time"
                        style={{ width: '100%' }}
                        value={taskDate}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        onChange={(date) => setTaskDate(date)}
                    />
                    {editingTask ? (
                        <Button type="primary" icon={<PlusOutlined />} onClick={updateTask} block>
                            Update Task
                        </Button>
                    ) : (
                        <Button type="primary" icon={<PlusOutlined />} onClick={addTask} block>
                            Add Task
                        </Button>
                    )}
                </Space>
            </Card>
            <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
    );
};

export default ToDoForm;
