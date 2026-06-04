import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1800,
  duration: '5m',
};

export default function () {
  http.get('https://f2nrinvnh9.execute-api.us-east-1.amazonaws.com/Prod/lessons/1');
  sleep(0.5);
}