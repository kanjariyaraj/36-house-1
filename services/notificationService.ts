export const requestPermission = async (): Promise<void> => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
    }

    // Only request permission if it's not already denied.
    if (Notification.permission !== 'denied') {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission was not granted.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }
};

export const sendNotification = (title: string, options?: NotificationOptions): void => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
    }

    if (Notification.permission === 'granted') {
        const notification = new Notification(title, options);
        
        // Bring the window to the front on click
        notification.onclick = () => {
            window.focus();
        };
    }
};