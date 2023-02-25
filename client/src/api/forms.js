import axiosClient from './axiosClient';

// TODO
const TEST_USERNAME = 'chonkshiba28';

export const fetchSpreadsheetData = (reportId, formPageId) =>
  axiosClient.get(`/user/${TEST_USERNAME}/reports/${reportId}/form/${formPageId}`).then((res) => res.data);

export const updateSpreadsheetData = (reportId, formPageId, spreadsheetData) =>
  axiosClient
    .post(`/user/${TEST_USERNAME}/reports/${reportId}/form/${formPageId}`, { data: spreadsheetData })
    .then((res) => res.data);
