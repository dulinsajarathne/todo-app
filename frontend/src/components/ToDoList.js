// ToDoList.js
import React, { useState } from 'react';
import { Input, Button, Card, Space, DatePicker, message } from 'antd';

import moment from 'moment';
import ToDoTabs from './ToDoTabs';
import './ToDoForm.css';

const ToDoList = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortCriteria, setSortCriteria] = useState('date');
  const [errorMessage, setErrorMessage] = useState('');


  // Add a new task
  const addTask = () => {
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
      date: taskDate.format('YYYY-MM-DD HH:mm'),
      enteredDate: Date.now(),
      id: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDate(null);
    setErrorMessage(''); // Clear error message after successful submission
  };


  const editTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDate(moment(task.date, 'YYYY-MM-DD HH:mm'));
  };

  const updateTask = () => {
    if (taskTitle && taskDate) {
      const updatedTask = { ...editingTask, title: taskTitle, description: taskDescription, date: taskDate.format('YYYY-MM-DD HH:mm') };
      setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      setEditingTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDate(null);
    } else {
      message.error('Please fill out the title and date/time');
    }
  };

  const markAsCompleted = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks(tasks.filter((t) => t.id !== id));
    setCompletedTasks([...completedTasks, { ...task, completedDate: moment().format('YYYY-MM-DD HH:mm') }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setCompletedTasks(completedTasks.filter((t) => t.id !== id));
  };

  const sortTasks = (tasks, criteria, order) => {
    return tasks.sort((a, b) => {
      const compareA = criteria === 'date' ? moment(a.date) : a.enteredDate;
      const compareB = criteria === 'date' ? moment(b.date) : b.enteredDate;
      return order === 'asc' ? compareA - compareB : compareB - compareA;
    });
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '8px' }}>
              {errorMessage}
            </div>
          )}
          <Input
            placeholder="Title"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              setErrorMessage(''); // Clear error message when user starts typing
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
              setErrorMessage(''); // Clear error message when date is selected
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
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortTasks={sortTasks}
      />
    </div>
  );
};

export default ToDoList;
