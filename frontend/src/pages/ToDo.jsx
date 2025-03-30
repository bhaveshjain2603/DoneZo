import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Checkbox, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Trash2, Edit } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToDo() {
  const [isLogin, setIsLogin] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    if (userName) {
      fetchTasks();
    }
  }, [userName]);

  const authUser = async (e) => {

    try {
      const url = isLogin
          ? `${backendUrl}/api/auth/login`
          : `${backendUrl}/api/auth/signup`;

      const userData = isLogin
          ? { userEmail, userPassword }  
          : { userName: userName.trim(), userEmail, userPassword }; 

      console.log('Sending:', userData);

      const response = await axios.post(url, userData, {
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.data) {
        const { userName, token } = response.data;
  
        if (token) {
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
  
        if (isLogin) {
          setUserName(userName); 
          toast.success(`Welcome back, ${userName}!`, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setModalOpen(false)
          fetchTasks();
        } else {
          toast.success("Signup successful!", {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setModalOpen(false)
          setIsLogin(false); 
          fetchTasks();
        }
  
        return true;
      }
    } catch (error) {
        console.error('Auth error:', error);
        if (error.code === 'ERR_NETWORK') {
            toast.error('Cannot connect to server. Please try again later.');
            return;
        }
        if (error.response?.status === 500) {
            toast.error('Server error. Please try again later.');
            return;
        }
    }
  }

  const fetchTasks = async () => {
    console.log("Fetching tasks for user: ", userEmail);
    try {
      if (!userEmail) {
        toast.error("Error fetching tasks", {
          position: "top-center",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      const response = await axios.get(`${backendUrl}/api/tasks/${userEmail}`);
      if (response.data) {
        const { userName, tasks } = response.data; 
        setUserName(userName); 
        setTasks(tasks); 
      }
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(`${backendUrl}/api/tasks/`, {
        userName,
        userEmail,
        title: newTask,
        completed: false,
      });
      toast.success("Task Added Successfully!", {
        position: "top-center",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding tasks: ", error);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/tasks/${task._id}`,
        {
          title: task.title,
          completed: !task.completed,
        }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
      if (!task.completed) {
        toast.success("Task Completed!", {
          position: "top-center",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Task Uncompleted!", {
          position: "top-center",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${backendUrl}/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task Deleted Successfully!", {
        position: "top-center",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const saveEditedTask = async () => {
    if (!editingTask.title.trim()) return;

    try {
      const response = await axios.put(
        `${backendUrl}/api/tasks/${editingTask._id}`,
        editingTask
      );
      setTasks(
        tasks.map((t) => (t._id === editingTask._id ? response.data : t))
      );
      setEditingTask(null);
      toast.success("Task Edited Successfully!", {
        position: "top-center",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error saving edited task: ", error);
    }
  };

  const handleModalSubmit = async () => {
    if (isLogin) {
      if (!userEmail || !userPassword) {
        toast.error("Please enter all your credentials", {
          position: "top-center",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const isAuthenticated = await authUser(); 
        if (isAuthenticated) {
          setModalOpen(false);
        } else {
          setModalOpen(true);
          toast.error("User not found, please sign up!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } else {
      if (!userName || !userEmail || !userPassword) {
        toast.error("Please enter all your credentials", {
          position: "top-center",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const isAuthenticated = await authUser();
        if (isAuthenticated) {
          setModalOpen(false);
        } else {
          setModalOpen(true);
          toast.error("User already exists, please login!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    }
  };

  return (
    <div className="main" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      {isModalOpen ? (
        <form style={modalStyle} onSubmit={handleModalSubmit}>
          <div style={modalContentStyle}>
            <Typography variant="h6" gutterBottom>
              {isLogin ? "Welcome Back" : "Create an Account" }
            </Typography>
            {!isLogin && (
              <TextField
                fullWidth
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                variant="outlined"
                style={{ marginBottom: "20px" }}
              />
            )}
            <TextField
              fullWidth
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your Email"
              variant="outlined"
              style={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Your Password"
              variant="outlined"
              style={{ marginBottom: "20px" }}
            />
            <Button variant="contained" color="primary" onClick={handleModalSubmit}>
              {isLogin ? "Login" : "Signup"}
            </Button>
            <div className="mt-6 text-center text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                  onClick={() => setIsLogin((prev) => !prev)}
              >
                  {isLogin ? 'Sign up' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Card style={cardStyle}>
          <CardHeader title={`${userName}'s To-Do List`} />
          <CardContent>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <TextField
                fullWidth
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
                variant="outlined"
                style={{ marginRight: "10px" }}
              />
              <Button variant="contained" onClick={addTask}>
                Add
              </Button>
            </div>

            {tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "14px",
                }}
              >
                {editingTask && editingTask._id === task._id ? (
                  <div style={{ display: "flex", width: "100%" }}>
                    <TextField
                      fullWidth
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      style={{ marginRight: "10px" }}
                    />
                    <Button variant="contained" color="primary" onClick={saveEditedTask}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => updateTask(task)}
                    />
                    <span
                      style={{
                        flexGrow: 1,
                        textDecoration: task.completed ? "line-through" : "none",
                        color: task.completed ? "#888" : "#000",
                      }}
                    >
                      {task.title}
                    </span>
                    <Button
                      onClick={() => startEditing(task)}
                      style={{ marginRight: "10px" }}
                    >
                      <Edit />
                    </Button>
                    <Button color="error" onClick={() => deleteTask(task._id)}>
                      <Trash2 />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "300px",
};

const cardStyle = {
  alignItems: "center",
  justifyContent: "center",
  margin: "8rem auto",
  borderRadius: "18px",
  padding: "20px",
  maxWidth: "600px",
  textAlign: "center"
};

export default ToDo;