import KodMQ from 'kodmq';
import kodmqLauncher from 'kodmq/launcher';

(async function() {
    async function sendEmail({
        subject: _, 
        body: __, 
    }: { subject: string; body: string }) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
    }
    
    async function processPayment({ amount: _ }: { amount: number }) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
    }
    
    async function renewSubscription({ userId: _ }: { userId: number }) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
    }
    
    async function sendReward({ user: _ }: { user: string }) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
    
        if (Math.random() < 0.5) throw new Error('Failed to send invoice');
    }
    
    async function fireJim() {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
        throw new Error('Jim is never going to be fired');
    }
    
    const kodmq = new KodMQ({
        handlers: {
            fireJim,
            processPayment,
            renewSubscription,
            sendEmail,
            sendReward,
        },
    });
    
    if (!process.argv.includes('--no-clear')) {
        await kodmq.adapter.clearAll();
    } else {
        console.log('Skipping clearAll()');
        console.log();
    }
    
    const emails = [
        { body: 'You won!', subject: 'Woody Harrelson' },
        { body: 'This is a test email.', subject: 'Wow, it works!' },
        { body: 'This is a test email.', subject: 'Amazing!' },
        { body: 'This is a test email.', subject: 'Awesome!' },
        { body: 'This is a test email.', subject: 'Great!' },
    ];
    
    for (const email of emails) {
        setTimeout(() => kodmq.performJob('sendEmail', email), 1000);
    }
    
    const payments = [
        1000000,
        2000000,
        3000000,
        4000000,
        5000000,
    ];
    
    for (const amount of payments) {
        setTimeout(() => kodmq.performJob('processPayment', { amount }), 1000);
    }
    
    const users = [
        'Woody Harrelson',
        'Joaquin Phoenix',
        'Keanu Reeves',
        'Brad Pitt',
        'Morgan Freeman',
        'Robert Downey Jr.',
        'Angelina Jolie',
        'Megan Fox',
    ];
    
    for (const user of users) {
        setTimeout(() => kodmq.performJob('sendReward', { user }), 1000);
    }
    
    const userIds = [
        451,
    ];
    
    for (const userId of userIds) {
        setTimeout(() => kodmq.scheduleJob(new Date(Date.now() + 1000 * 60 * 60 * (Math.random() * 10)), 'renewSubscription', { userId }), 1000);
    }
    
    setTimeout(() => kodmq.performJob('fireJim'), 1000);
    await kodmqLauncher(kodmq);
})();
