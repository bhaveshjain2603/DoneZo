import Task from '../models/Task.model.js';
import User from '../models/User.model.js';

//Get all tasks
export const getTaskByEmail = async (req, res) => {
    const { userEmail } = req.params;
    try {
        const tasks = await Task.find({ userEmail });
        const user = await User.findOne({ userEmail: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            userName: user.userName,
            tasks: tasks
        });

    } catch (error) {
        res.status(500).json({error: 'Failed to fetch tasks'});
    }
}

//Add a new task
export const addTask = async (req, res) => {
    const { userName, userEmail, title, completed } = req.body;
    try {
        const task = await Task.create({ userName, userEmail, title, completed })
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to add task' });
    }
}

//Update a task
export const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const task = await Task.findByIdAndUpdate(
            id,
            { title, completed }
        )
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
}

//Delete a task
export const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if(!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        res.status(200).json({ message: 'Task deleted' })
    } catch(error) {
        res.status(400).json({ error: 'Failed to delete task' })
    }
}