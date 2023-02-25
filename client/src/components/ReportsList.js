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
        setReports(allReports);
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
        Your Reports{' '}
        <Button color="info" variant="outlined" onClick={loadUserReports} disabled={loading} size="small">
          Refresh
        </Button>
      </h5>

      {reports && reports.map && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Last Updated</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{report.id.substring(0, 8)}</TableCell>
                  <TableCell align="right">{report.title}</TableCell>
                  <TableCell align="right">{report.status}</TableCell>
                  <TableCell align="right">{moment(report.updatedAt).fromNow()}</TableCell>
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
