import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Space, DatePicker, message } from 'antd';
import { useAuth } from '../../context/authContext';
import moment from 'moment-timezone';
import ToDoTabs from './ToDoTabs';
import './ToDoForm.css';
import axiosInstance from '../../common/axiosInstance';
import Cookies from 'js-cookie'; // Import js-cookie

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

  useEffect(() => {
    console.log("user in ToDoList:", user); // Debugging log
  }, [user]);
  
  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      
      try {
        console.log('ToDoList.js: user:', user);
        console.log('Cookies:', Cookies.get('token'));  // Log the entire cookie storage in the browser

       // const token = Cookies.get('token'); // Get token from cookies
        const response = await axiosInstance.get('/api/tasks', {
          withCredentials: true,
        });
        setTasks(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token is invalid, remove it and redirect to login
          Cookies.remove('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchTasks();
  }, [user]);

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
      dueDate: taskDate.toISOString(),
      enteredDate: Date.now(),
    };

    try {
      //const token = Cookies.get('token'); // Get token from cookies
      const response = await axiosInstance.post('/api/tasks', newTask, {
        withCredentials: true,
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

  const sortTasks = (tasks, criteria, order) => {
    const sortedTasks = [...tasks]; // Create a copy to avoid mutating the original array

    return sortedTasks.sort((a, b) => {
      let compareA, compareB;

      if (criteria === 'date') {
        compareA = moment(a.dueDate);
        compareB = moment(b.dueDate);
      } else if (criteria === 'enteredDate') {
        compareA = moment(a.createdAt);
        compareB = moment(b.createdAt);
      }

      // Use `isBefore` for Moment.js date comparison
      if (order === 'asc') {
        return compareA.isBefore(compareB) ? -1 : 1;
      } else {
        return compareA.isAfter(compareB) ? -1 : 1;
      }
    });
  };


  const updateTask = async () => {
    if (taskTitle && taskDate) {
      const updatedTask = { ...editingTask, title: taskTitle, description: taskDescription, date: taskDate.format('YYYY-MM-DD HH:mm') };

      try {
        //const token = Cookies.get('token'); // Get token from cookies
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, updatedTask, {
          withCredentials: true,
        });
        setTasks(tasks.map((t) => (t._id === editingTask._id ? response.data : t)));
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
    console.log('Marking task as completed:', id);
    const task = tasks.find((t) => t._id === id);  // Ensure matching by '_id' not 'id'

    try {
      //const token = Cookies.get('token'); // Get token from cookies

      // Send PATCH request to the backend to mark task as completed
      await axiosInstance.patch(`/api/tasks/${id}/complete`, { completed: true }, {
        withCredentials: true,
      });

      // Update local task list by filtering out the completed task and adding it to the completed tasks list
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task._id === id) {
            return { ...task, completed: true };  // Mark the task as completed
          }
          return task;
        });
      });  // Use '_id' for MongoDB ID
      console.log('Tasks:', completedTasks);
      setCompletedTasks([
        ...completedTasks,
        { ...task, completedAt: moment().format('YYYY-MM-DD HH:mm') }
      ]);

      console.log('Task marked as completed:', task);
    } catch (error) {
      console.error('Error marking task as completed:', error);
      message.error('Failed to mark task as completed.');
    }
  };

  const deleteTask = async (id) => {
    try {
     // const token = Cookies.get('token'); // Get token from cookies
      await axiosInstance.delete(`/api/tasks/${id}`, {
        withCredentials: true,
      });

      setTasks(tasks.filter((task) => task._id !== id));
      setCompletedTasks(completedTasks.filter((task) => task._id !== id));

      message.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task.');
    }
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Card style={{background:'#093a6b' }}>
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
