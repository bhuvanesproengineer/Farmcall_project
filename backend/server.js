import express from 'express';
import cors from 'cors';
import { getFarmcall } from './services/farmcall.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.get('/farmcall', getFarmcall);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});