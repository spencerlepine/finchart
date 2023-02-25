import React from 'react';
import Layout from '../styles/Layout';
import { Button, Card, Container, Paper, Toolbar } from '@mui/material';
import { submitReportImport } from '../api/reports';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function DragDropFile({ handleSubmitImport }) {
  const [previewJSON, setPreviewJSON] = React.useState(null);
  const inputRef = React.useRef(null);

  const handleFileFormClear = () => {
    setPreviewJSON(null);
  };

  const handleFileFormSubmit = () => {
    handleSubmitImport(JSON.parse(previewJSON), () => {
      handleFileFormClear();
    });
  };

  function handleFile(files) {
    if (files.length > 1) {
      alert('Cannot upload more than 1 report!');
    }

    const fileReader = new FileReader();
    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = (e) => {
      setPreviewJSON(e.target.result);
    };
  }

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      {previewJSON === null && (
        <Box>
          <Card sx={{ border: 2, my: 2, p: 4 }}>
            <input
              ref={inputRef}
              type="file"
              id="input-file-upload"
              onChange={handleChange}
              accept="application/JSON"
              disabled={previewJSON}
            />
          </Card>
        </Box>
      )}

      {previewJSON && (
        <Box>
          <Toolbar>
            <h5 justifyContent="start">Preview JSON</h5>

            <Box sx={{ my: 2, marginLeft: 'auto' }} display="flex" justifyContent="flex-end" alignItems="flex-end">
              <Button
                variant="contained"
                color="error"
                size="medium"
                onClick={handleFileFormClear}
                sx={{ marginRight: '0.5em' }}
              >
                CLEAR
              </Button>
              <Button variant="contained" color="success" size="medium" onClick={handleFileFormSubmit}>
                SUBMIT
              </Button>
            </Box>
          </Toolbar>

          <Paper>
            <pre>{previewJSON}</pre>
          </Paper>
        </Box>
      )}
    </form>
  );
}

const Import = () => {
  const navigate = useNavigate();

  const handleSubmitImport = (reportJSON, resetForm) => {
    submitReportImport(reportJSON)
      .then(() => {
        navigate('/reports');
        resetForm();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to import form');
        resetForm();
      });
  };

  return (
    <Layout>
      <Container>
        <Button size="medium" variant="contained" contained="true" color="info" to="/reports" component={Link}>
          Back to Reports
        </Button>

        <Box sx={{ my: 3 }}>
          <h5>Import FinChart Report</h5>
          <p>
            Upload <code>.json</code> files, currently accepting from finchart@1.0.0 exports.
          </p>
        </Box>

        <DragDropFile handleSubmitImport={handleSubmitImport} />
      </Container>
    </Layout>
  );
};

export default Import;
