import { EventTask } from '../types';

// Simple list of common "stop words" to ignore during keyword extraction
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'is', 'in', 'it', 'of', 'for', 'on', 'with', 'to', 'go', 'out',
  'be', 'has', 'are', 'as', 'at', 'by', 'if', 'or', 'do', 'get'
]);

/**
 * Extracts meaningful keywords from a string of text.
 * It converts text to lowercase, removes punctuation, and filters out common stop words.
 * @param text The text to process.
 * @returns A Set of unique keywords.
 */
const extractKeywords = (text: string): Set<string> => {
    if (!text) return new Set();
    return new Set(
        text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // remove punctuation
            .split(/\s+/) // split by spaces
            .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    );
};

/**
 * Generates a list of recommended sessions for an attendee.
 * @param allTasks The list of all available sessions/tasks.
 * @param interestedTaskIds An array of IDs for tasks the user has shown interest in.
 * @param count The number of recommendations to return.
 * @returns An array of recommended EventTask objects.
 */
export const getRecommendedSessions = (
    allTasks: EventTask[],
    interestedTaskIds: number[],
    count: number = 3
): EventTask[] => {
    const interestedTasks = allTasks.filter(task => interestedTaskIds.includes(task.id));
    
    if (interestedTasks.length === 0) {
        return []; // Cannot make recommendations without a basis.
    }

    // Combine all keywords from the tasks the user is interested in.
    const interestKeywords = new Set<string>();
    interestedTasks.forEach(task => {
        const titleKeywords = extractKeywords(task.title);
        const descKeywords = extractKeywords(task.description);
        titleKeywords.forEach(kw => interestKeywords.add(kw));
        descKeywords.forEach(kw => interestKeywords.add(kw));
    });

    // Create a pool of candidate tasks, excluding those the user is already interested in.
    const candidateTasks = allTasks.filter(task => !interestedTaskIds.includes(task.id));

    const scoredTasks = candidateTasks.map(task => {
        const titleKeywords = extractKeywords(task.title);
        const descKeywords = extractKeywords(task.description);
        
        let score = 0;
        titleKeywords.forEach(kw => {
            if (interestKeywords.has(kw)) {
                score += 2; // Give higher weight to matches in the title.
            }
        });
        descKeywords.forEach(kw => {
            if (interestKeywords.has(kw)) {
                score += 1;
            }
        });

        return { task, score };
    });

    // Filter out tasks with no matching keywords, sort by score, and return the top results.
    return scoredTasks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(item => item.task);
};