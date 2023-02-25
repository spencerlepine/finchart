import axiosClient from './axiosClient';

// TODO
const TEST_USERNAME = 'chonkshiba28';

export const createNewReport = (newReportTitle) =>
  axiosClient
    .post(`/user/${TEST_USERNAME}/reports`, { title: newReportTitle, userId: TEST_USERNAME })
    .then((res) => res.data);

export const deleteExistingReport = (reportId) =>
  axiosClient.delete(`/user/${TEST_USERNAME}/reports/${reportId}`).then((res) => res.data);

export const fetchOneReport = (reportId) =>
  axiosClient.get(`/user/${TEST_USERNAME}/reports/${reportId}`).then((res) => res.data);

export const fetchAllReports = () => axiosClient.get(`/user/${TEST_USERNAME}/reports`).then((res) => res.data);

export const updateReportMetadata = (reportId, newReportMetadata) =>
  axiosClient.put(`/user/${TEST_USERNAME}/reports/${reportId}`, newReportMetadata).then((res) => res.data);

export const generateReportExport = (reportId) =>
  axiosClient.get(`/user/${TEST_USERNAME}/reports/${reportId}/export`).then((res) => res.data);

export const submitReportImport = (reportJSON) =>
  axiosClient.post(`/user/${TEST_USERNAME}/import`, reportJSON).then((res) => res.data);

export const fetchLatestReport = () => axiosClient.get(`/user/${TEST_USERNAME}/reports/latest`).then((res) => res.data);
