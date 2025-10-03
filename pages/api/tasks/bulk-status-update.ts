import type { NextApiRequest, NextApiResponse } from 'next';
import { TaskStatus } from '../../../types';
import { getDB, saveDB } from '../db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { taskIds, status } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0 || !status) {
        return res.status(400).json({ message: 'Invalid request body. "taskIds" (array) and "status" are required.' });
    }

    if (!Object.values(TaskStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status value provided.' });
    }

    const db = getDB();
    let updatedCount = 0;

    db.tasks.forEach(task => {
        if (taskIds.includes(task.id)) {
            task.status = status;
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        saveDB(db);
    }
    
    res.status(200).json({ message: `${updatedCount} tasks updated successfully.` });
}