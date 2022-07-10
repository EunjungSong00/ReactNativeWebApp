import axios from 'axios';

export async function requestAxiosGet(url: string, params?: any): Promise<any> {
  const response = await axios
    .get(`http://dev.search.carmerce.co.kr/${url}${params ? `?${params}` : ''}`)
    .then((res) => handleAxiosThen(res))
    .catch((error) => handleAxiosCatch(error));
  return response;
}

export function requestAxiosPost(url: string, data?: any): any {
  const response = axios
    .post(`http://dev.search.carmerce.co.kr/${url}`, data)
    .then((res) => handleAxiosThen(res))
    .catch((error) => handleAxiosCatch(error));
  return response;
}

function handleAxiosThen(res: any): any {
  return res.data;
}

function handleAxiosCatch(error: any): any {
  return error;
}
