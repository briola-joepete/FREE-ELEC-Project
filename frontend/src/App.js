import { useEffect, useState } from 'react';
import './App.css';
import Header from './component/Header';
import axios from 'axios';
import Modal from 'react-modal';

const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [list, setList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');  // Represents Remarks (Status)
  const [userId, setUserId] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showTodos = async () => {
    try {
      const { data } = await axios.get('/api/show/todos');
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add Todo
  const addtodo = async (e) => {
    e.preventDefault();
    try {
      const add = await axios.post('/api/create/list', { firstName, lastName });
      if (add.status === 200) {
        setFirstName('');
        setLastName('');
        showTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      const todoDelete = await axios.delete(`/api/delete/todo/${id}`);
      if (todoDelete.status === 200) {
        showTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Populate single Todo in the form
  const showSingleTodo = async (id) => {
    setEditMode(true);
    setIsModalOpen(true);

    try {
      const { data } = await axios.get(`/api/todo/${id}`);
      setFirstName(data.firstName);
      setLastName(data.lastName);  // Set Remarks (Status)
      setUserId(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Todo
  const editTodo = async (e) => {
    e.preventDefault();

    try {
      const edit = await axios.put(`/api/update/todo/${userId}`, { firstName, lastName });
      if (edit.status === 200) {
        setEditMode(false);
        setFirstName('');
        setLastName('');
        setIsModalOpen(false);  // Close modal after edit
        showTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showTodos();
  }, []);

  return (
    <>
      <Header />
      <div className="container" 
      style={{ 
              maxWidth: '500px', 
              margin  : '0 auto', 
              padding : '20px',
              // backgroundImage: 'url(/school_bg.jpg)',  
              // backgroundSize: 'cover',
              // backgroundPosition: 'center',
            }}>
        <div className="form" style={{ paddingBottom: '50px', paddingTop: '50px' }}>
          <form onSubmit={editMode ? editTodo : addtodo}>
            <div className="form-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="form-control"
                  type="text"
                  placeholder="Tasks"
                  name="firstName"
                />
              </div>
              <div style={{ flex: 1 }}>
                {/* Dropdown for Remarks (Status) */}
                <select
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="form-control"
                  name="lastName"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {editMode ? (
                <button type="submit" style={{ width: '200px', marginLeft: '10px' }} className="btn btn-primary">
                  Edit
                </button>
              ) : (
                <button type="submit" style={{ width: '200px', marginLeft: '10px' }} className="btn btn-success">
                  + Add
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tasks</th>
              <th scope="col">Status</th>
              <th scope="col">Timestamp</th> {/* Add Timestamp column */}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((d) => (
                <tr key={d.id}>
                  <th scope="row">{d.id}</th>
                  <td >{d.firstName}</td>
                  <td>{d.lastName}</td> {/* Display Remarks (Status) */}
                  <td>{d.timestamp}</td> {/* Display timestamp */}
                  <td>
                    <i
                      onClick={() => showSingleTodo(d.id)}
                      className="fa-solid fa-pen-to-square"
                      style={{ color: 'green', cursor: 'pointer', marginRight: '25px' }}
                    ></i>
                    <i
                      onClick={() => deleteTodo(d.id)}
                      style={{ color: 'red', cursor: 'pointer' }}
                      className="fa-solid fa-trash-can"
                    ></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Edit Todo">
        <h2>Edit Task</h2>
        <form onSubmit={editTodo}>
          <div className="form-wrapper">
            <div style={{ flex: 1, marginRight: '10px' }}>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="form-control"
                type="text"
                placeholder="Tasks"
                name="firstName"
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* Dropdown for Remarks (Status) in the modal */}
              <select
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="form-control"
                name="lastName"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default App;
