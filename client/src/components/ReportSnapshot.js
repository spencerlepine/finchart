import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextareaAutosize, TextField, Typography } from '@mui/material';
import { fetchOneReport, deleteExistingReport, generateReportExport, updateReportMetadata } from '../api/reports';
import moment from 'moment';
import 'moment-timezone';
import generateReportFileName from '../utils/generateReportFileName';
import TableEditor from './TableEditor';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// TODO
// import staticReportSnapshot from '../__mocks__/fakeReportSnapshot.json';

import config from '../config';
const { INITIAL_FORM_PAGE_ID } = config;

const TitleEditor = ({ reportSnapshotData, editingTitle, titleInput, setEditingTitle, saveNewMetadata, setTitleInput }) => (
  <>
    {editingTitle ? (
      <>
        <TextField
          id="outlined-basic"
          label="Report Title"
          defaultValue={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
        <Button
          sx={{ margin: '0.5em', marginRight: 'auto' }}
          size="small"
          variant="outlined"
          onClick={() => {
            setEditingTitle(false);
            saveNewMetadata();
          }}
        >
          Save
        </Button>
      </>
    ) : (
      <>
        <Typography variant="h4" sx={{ marginRight: '0.5em' }}>
          {reportSnapshotData.title}
        </Typography>
        <Button sx={{ marginRight: 'auto' }} size="small" variant="outlined" onClick={() => setEditingTitle(true)}>
          Rename
        </Button>
      </>
    )}
  </>
);

const NotesEditor = ({ reportSnapshotData, editingNotes, notesInput, setEditingNotes, saveNewMetadata, setNotesInput }) => (
  <Box my={4}>
    {editingNotes ? (
      <>
        <TextareaAutosize
          maxRows={4}
          aria-label="maximum height"
          placeholder="Type notes here"
          onChange={(e) => setNotesInput(e.target.value)}
          defaultValue={notesInput}
          style={{ width: 200 }}
        />
        <Button
          sx={{ margin: '0.5em', marginRight: 'auto' }}
          size="small"
          variant="outlined"
          onClick={() => {
            setEditingNotes(false);
            saveNewMetadata();
          }}
        >
          Save
        </Button>
      </>
    ) : (
      <>
        <Typography sx={{ marginRight: '0.5em' }}>{reportSnapshotData.notes || 'Add notes here'}</Typography>
        <Button sx={{ marginRight: 'auto' }} size="small" variant="outlined" onClick={() => setEditingNotes(true)}>
          Edit Notes
        </Button>
      </>
    )}
  </Box>
);

const DateEditor = ({
  reportSnapshotData,
  reportDateInput,
  setReportDateInput,
  saveNewMetadata,
  setEditingDate,
  editingDate,
}) => (
  <Box my={4}>
    {editingDate ? (
      <>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            onChange={(newValue) => {
              setReportDateInput(newValue);
            }}
          />
        </LocalizationProvider>
        <Button
          sx={{ margin: '0.5em', marginRight: 'auto' }}
          size="small"
          variant="outlined"
          onClick={() => {
            setEditingDate(false);
            saveNewMetadata();
          }}
        >
          Save
        </Button>
        <Button
          sx={{ margin: '0.5em', marginRight: 'auto' }}
          size="small"
          color="error"
          variant="outlined"
          onClick={() => {
            setEditingDate(false);
          }}
        >
          Cancel
        </Button>
      </>
    ) : (
      <>
        <Typography sx={{ marginRight: '0.5em' }}>{moment(reportDateInput).format('YYYY-MM-DD')}</Typography>
        <Button sx={{ marginRight: 'auto' }} size="small" variant="outlined" onClick={() => setEditingDate(true)}>
          Edit Report Date
        </Button>
      </>
    )}
  </Box>
);

const ReportSnapshot = ({ reportId }) => {
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('Default Title');
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [reportDateInput, setReportDateInput] = useState('');
  const [reportSnapshotData, setReportSnapshotData] = useState(null);
  const navigate = useNavigate();

  const loadSnapshotData = () => {
    setLoading(true);

    void fetchOneReport(reportId)
      .then((reportMetadata) => {
        setReportSnapshotData(reportMetadata);
        setTitleInput(reportMetadata.title);
        setNotesInput(reportMetadata.notes);
        setReportDateInput(reportMetadata.reportDate || reportMetadata.lastUpdated);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleReportDelete = () => {
    const confirmReportTitle = window.prompt('If you wish to delete this report, type: confirm');
    if (confirmReportTitle === 'confirm') {
      setLoading(true);

      void deleteExistingReport(reportId)
        .then(() => navigate('/reports'))
        .catch((err) => {
          window.alert('Failed to delete report');
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleReportExport = () => {
    void generateReportExport(reportId)
      .then((reportJSON) => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(reportJSON, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = generateReportFileName(reportJSON.title, new Date(reportJSON.createdAt) || new Date.now());
        link.click();
      })
      .catch((err) => {
        console.error('Unable to export report', err);
        window.alert('Unable to export report');
      });
  };

  const handleReportEdit = (id = INITIAL_FORM_PAGE_ID) => {
    navigate(`/reports/${reportId}/${id}`);
  };

  const saveNewMetadata = () => {
    setEditingTitle(false);
    setEditingNotes(false);
    setEditingDate(false);

    const titleChanged = !!titleInput && titleInput !== reportSnapshotData.title;
    const notesChanged = !!notesInput && notesInput !== reportSnapshotData.notes;
    const dateChanged = !!reportDateInput && reportDateInput !== reportSnapshotData.reportDate;
    if (titleChanged || notesChanged || dateChanged) {
      setLoading(true);

      const newMetadata = { title: titleInput };
      if (notesInput) {
        newMetadata.notes = notesInput;
      }
      if (reportDateInput) {
        newMetadata.reportDate = reportDateInput;
      }

      void updateReportMetadata(reportId, newMetadata)
        .then(() => {
          setReportSnapshotData((prevConfig) => ({
            ...prevConfig,
            title: titleInput,
            notes: notesInput,
            reportDate: reportDateInput,
          }));
          setTitleInput(titleInput);
          setNotesInput(notesInput);
          setReportDateInput(reportDateInput);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setTitleInput(reportSnapshotData.title);
          setNotesInput(reportSnapshotData.notes);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadSnapshotData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  if (loading) {
    return (
      <div>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </div>
    );
  } else if (!reportSnapshotData) {
    return <p>Unable to load report</p>;
  }

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" alignItems="flex-end" px={3} my={2}>
        <TitleEditor
          reportSnapshotData={reportSnapshotData}
          editingTitle={editingTitle}
          titleInput={titleInput}
          setEditingTitle={setEditingTitle}
          saveNewMetadata={saveNewMetadata}
          setTitleInput={setTitleInput}
        />
        <Button
          sx={{ marginRight: '0.5em' }}
          size="small"
          variant="contained"
          color="warning"
          onClick={() => handleReportEdit()}
        >
          Edit
        </Button>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="contained" color="success" onClick={handleReportExport}>
          Export
        </Button>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="contained" color="error" onClick={handleReportDelete}>
          Delete
        </Button>
      </Box>

      <Box mt={3} mb={3} display="flex" px={3}>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="outlined" onClick={loadSnapshotData}>
          Refresh
        </Button>
        <Typography>Updated: {moment(reportSnapshotData.updatedAt).fromNow()}</Typography>
      </Box>

      <Paper>
        {reportSnapshotData.spreadsheets &&
          reportSnapshotData.spreadsheets.map &&
          reportSnapshotData.spreadsheets.map((spreadsheet) => (
            <TableEditor
              formPageId={spreadsheet.formPageId}
              reportId={spreadsheet._id}
              isReadOnly={true}
              hasLinkToEditPage={true}
              handleOpenEditPage={handleReportEdit}
              setPageLoading={setLoading}
              initialSpreadsheetConfig={spreadsheet}
            />
          ))}
      </Paper>

      <NotesEditor
        reportSnapshotData={reportSnapshotData}
        editingNotes={editingNotes}
        notesInput={notesInput}
        setEditingNotes={setEditingNotes}
        saveNewMetadata={saveNewMetadata}
        setNotesInput={setNotesInput}
      />

      <DateEditor
        reportSnapshotData={reportSnapshotData}
        editingDate={editingDate}
        reportDateInput={reportDateInput}
        setEditingDate={setEditingDate}
        saveNewMetadata={saveNewMetadata}
        setReportDateInput={setReportDateInput}
      />

      {/* <Paper>
        <p>Last Updated: {moment(reportSnapshotData.updatedAt).fromNow()}</p>
        <p>Status: {reportSnapshotData.status}</p>

        <h4>Sankey Diagram</h4>
        <img src={staticReportSnapshot.sankeyImageBase64} width={250} />

        <h4>Income Pie Chart</h4>
        <img src={staticReportSnapshot.incomePiechartImageBase64} width={250} />

        <h4>Spending Pie Chart</h4>
        <img src={staticReportSnapshot.spendingPiechartImageBase64} width={250} />

        <h4>Allocations Pie Chart</h4>
        <img src={staticReportSnapshot.allocationsPiechartImageBase64} width={250} />
      </Paper> */}
    </div>
  );
};

export default ReportSnapshot;
