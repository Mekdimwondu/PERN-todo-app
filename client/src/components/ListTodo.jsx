import React, { useEffect, useState } from "react";

function ListTodo() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track any errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data);

        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = (todoId) => {
    const todo = todos.find((todo) => todo.todo_id === todoId);
    setCurrentTodo(todo);
    setNewDescription(todo.description);
    setIsModalOpen(true);
  };

  const handleDelete = async (todoId) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos(todos.filter((todo) => todo.todo_id !== todoId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentTodo(null);
  };

  const handleSaveUpdate = async () => {
    try {
      const updatedTodo = { ...currentTodo, description: newDescription };
      const response = await fetch(
        `http://localhost:5000/todos/${currentTodo.todo_id}`,
        {
          method: "PATCH", // Using PUT to update the todo
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const data = await response.json();
      const updatedTodos = todos.map((todo) =>
        todo.todo_id === currentTodo.todo_id
          ? { ...todo, description: data.description }
          : todo
      );
      setTodos(updatedTodos);
      handleModalClose();
      window.location = "/";
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>Error: {error}</div>; // Error state

  return (
    <div>
      <div className="flex flex-col space-y-4 px-40">
        {todos.map((todo) => (
          <div
            key={todo.todo_id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center">
              <p className="text-xl font-medium">{todo.description}</p>

              <div className="flex space-x-2">
                {/* Update Button */}
                <button
                  onClick={() => handleUpdate(todo.todo_id)}
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Update
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(todo.todo_id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for updating todo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4">Update Todo</h2>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border p-2 rounded-lg w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSaveUpdate}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Save
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListTodo;
