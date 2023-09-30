import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import moment from 'moment';
import { Button, Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchAllReports } from '../api/reports';

const ReportsList = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const loadUserReports = () => {
    setLoading(true);
    void fetchAllReports()
      .then((allReports) => {
        setReports(allReports.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUserReports();
  }, []);

  if (loading) {
    return (
      <div>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </div>
    );
  }

  return (
    <Grid m={2} pt={3}>
      <h5>
        All Reports{' '}
        <Button color="info" variant="outlined" onClick={loadUserReports} disabled={loading} size="small">
          Refresh
        </Button>
      </h5>

      {reports && reports.map && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Id</TableCell>
                <TableCell align="left">Last Updated</TableCell>
                <TableCell align="left">Report Date</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{report.title}</TableCell>
                  <TableCell align="left">{report.status}</TableCell>
                  <TableCell align="left">{report.id.substring(0, 8)}</TableCell>
                  <TableCell align="left">{moment(report.updatedAt).fromNow()}</TableCell>
                  <TableCell align="left">{moment(report.reportDate || report.updatedAt).format('YYYY-MM-DD')}</TableCell>
                  <TableCell align="right">
                    <a href={`/reports/${report.id}`}>View</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Grid>
  );
};

export default ReportsList;
