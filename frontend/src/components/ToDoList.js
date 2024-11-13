import React from 'react';
import ToDoItem from './ToDoItem';

function ToDoList({ tasks, deleteTask, updateTask, toggleComplete }) {
  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks to show</p>
      ) : (
        tasks.map((task) => (
          <ToDoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
            toggleComplete={toggleComplete}
          />
        ))
      )}
    </div>
  );
}

export default ToDoList;
