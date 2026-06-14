import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '3m', target: 1500 },
    { duration: '5m', target: 1800 },
  ],
};

export default function () {
    http.get('https://f2nrinvnh9.execute-api.us-east-1.amazonaws.com/Prod/lessons/1');
    sleep(0.5);
}   