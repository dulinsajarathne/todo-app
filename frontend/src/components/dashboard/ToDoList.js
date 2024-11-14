import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Space, DatePicker, message } from 'antd';
import { useAuth } from '../../context/authContext';
import moment from 'moment';
import ToDoTabs from './ToDoTabs';
import './ToDoForm.css';
import axiosInstance from '../../common/axiosInstance'; // Import axiosInstance

const ToDoList = () => {
  const { user } = useAuth();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortCriteria, setSortCriteria] = useState('date');

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token is invalid, remove it and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchTasks();
  }, [user]);

  // Sort tasks function
  const sortTasks = (tasks, criteria, order) => {
    return tasks.sort((a, b) => {
      const compareA = criteria === 'date' ? moment(a.date) : a.enteredDate;
      const compareB = criteria === 'date' ? moment(b.date) : b.enteredDate;
      return order === 'asc' ? compareA - compareB : compareB - compareA;
    });
  };

  // Add a new task
  const addTask = async () => {
    if (!taskTitle) {
      setErrorMessage('Please fill out the title.');
      return;
    }
    if (!taskDate) {
      setErrorMessage('Please select a date and time.');
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription || '',
      dueDate: taskDate.format('YYYY-MM-DD HH:mm'),
      enteredDate: Date.now(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDate(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task.');
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDate(moment(task.date, 'YYYY-MM-DD HH:mm'));
  };

  const updateTask = async () => {
    if (taskTitle && taskDate) {
      const updatedTask = { ...editingTask, title: taskTitle, description: taskDescription, date: taskDate.format('YYYY-MM-DD HH:mm') };

      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.put(`/api/tasks/${editingTask.id}`, updatedTask, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
        setEditingTask(null);
        setTaskTitle('');
        setTaskDescription('');
        setTaskDate(null);
      } catch (error) {
        console.error('Error updating task:', error);
        message.error('Failed to update task.');
      }
    } else {
      message.error('Please fill out the title and date/time');
    }
  };

  const markAsCompleted = async (id) => {
    const task = tasks.find((t) => t.id === id);

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(`/api/tasks/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((t) => t.id !== id));
      setCompletedTasks([...completedTasks, { ...task, completedDate: moment().format('YYYY-MM-DD HH:mm') }]);
    } catch (error) {
      console.error('Error marking task as completed:', error);
      message.error('Failed to mark task as completed.');
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log(id);
      await axiosInstance.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((t) => t.id !== id));
      setCompletedTasks(completedTasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task.');
    }
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      {!user ? (
        <div>Please log in to view and manage your tasks.</div>
      ) : (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            {errorMessage && <div style={{ color: 'red', marginBottom: '8px' }}>{errorMessage}</div>}
            <Input
              placeholder="Title"
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
                setErrorMessage('');
              }}
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
              onChange={(date) => {
                setTaskDate(date);
                setErrorMessage('');
              }}
            />
            <Button type="primary" onClick={editingTask ? updateTask : addTask}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </Space>
        </Card>
      )}
      <ToDoTabs
        tasks={tasks}
        completedTasks={completedTasks}
        onEdit={editTask}
        onDelete={deleteTask}
        onMarkAsCompleted={markAsCompleted}
        sortTasks={sortTasks}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default ToDoList;
