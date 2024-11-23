import { useState } from "react";

function InputTodo() {
  const [description, setdescription] = useState("");
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/";
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-4">Pern Todo List</h1>
      <form
        onSubmit={onSubmitForm}
        className="flex flex-col items-center space-y-4"
      >
        <input
          className="border p-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg w-80 hover:bg-blue-600 transition duration-300"
        >
          Add Todo
        </button>
      </form>
    </>
  );
}

export default InputTodo;
