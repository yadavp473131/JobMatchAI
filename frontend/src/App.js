import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/data")
      .then(response => setData(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddData = () => {
    axios.post("http://127.0.0.1:5000/api/data", { value: input })
      .then(() => {
        setData([...data, { value: input }]);
        setInput("");
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Flask + MongoDB + React App</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ul>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={handleAddData}>Add Data</button>
    </div>
  );
};

export default App;
