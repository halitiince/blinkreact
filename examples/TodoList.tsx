import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [count, setCount] = useState<number>(0);

  // Unnecessary effect that updates count on every render
  useEffect(() => {
    setCount(count + 1);
  }, [todos]); // This will cause unnecessary re-renders

  // Add a new todo
  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
    
    // Redundant state update
    setTodos([...todos, todo]);
  };

  // Toggle todo completion status
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Expensive calculation (simulated)
  const expensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  };

  // This will run on every render
  const expensiveResult = expensiveCalculation();

  return (
    <div className="todo-list">
      <h1>Todo List (Renders: {count})</h1>
      
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>
          Active
        </button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
          Completed
        </button>
      </div>
      
      <ul className="todos">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <div className="stats">
        <p>Total: {todos.length}</p>
        <p>Active: {todos.filter(todo => !todo.completed).length}</p>
        <p>Completed: {todos.filter(todo => todo.completed).length}</p>
        <p>Expensive Result: {expensiveResult}</p>
      </div>
    </div>
  );
};

export default TodoList; 