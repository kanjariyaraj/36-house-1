import type { NextApiRequest, NextApiResponse } from 'next';
import { EventTask, TaskStatus } from '../../../types';
import { getAllTasks, createTask } from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            try {
                const tasks = await getAllTasks();
                const sortedTasks = [...tasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                res.status(200).json(sortedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
            break;

        case 'POST':
            const { title, description, assignee, dueDate } = req.body;
            if (!title || !assignee || !dueDate) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            try {
                const newTask = await createTask({
                    title,
                    description,
                    assignee,
                    dueDate,
                    status: TaskStatus.Upcoming,
                });
                
                if (newTask) {
                    res.status(201).json(newTask);
                } else {
                    res.status(500).json({ message: 'Failed to create task' });
                }
            } catch (error) {
                console.error('Error creating task:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}