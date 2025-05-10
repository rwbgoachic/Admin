import express from 'express';
import path from 'path';

const app = express();
app.use(express.static('public'));
app.get('/health', (_, res) => res.send('ADMIN_OK')); 
app.listen(3000);