import React, { useEffect, useState } from 'react';
import { fetchStatusData } from '../api/status';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiErrorAlt } from 'react-icons/bi';

const statusWidgetStyles = {
  position: 'absolute',
  right: '1em',
  bottom: '1em',
  padding: '0.5em 0.5em 0em 0.5em',
  borderRadius: '0.25em',
};

const errorWidgetStyles = {
  ...statusWidgetStyles,
  border: '2px solid #ff7b7b',
  background: '#ffdcdc',
  color: 'black',
};

const successWidgetStyles = {
  ...statusWidgetStyles,
  border: '2px solid green',
  background: '#169516',
  color: 'white',
};

const StatusWidget = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [statusResult, setStatusResult] = useState(null);

  const fetchBackendStatus = () => {
    setLoading(true);

    fetchStatusData()
      .then((statusData) => {
        setStatusResult(statusData);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(JSON.stringify(err.response.status));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBackendStatus();
  }, []);

  if (loading) {
    return (
      <div style={statusWidgetStyles}>
        <AiOutlineLoading3Quarters /> <p>Checking status...</p>
      </div>
    );
  } else if (errorMsg) {
    return (
      <div style={errorWidgetStyles}>
        <p>
          <BiErrorAlt /> Server failed to respond - {errorMsg}
        </p>
      </div>
    );
  }

  return (
    <div style={successWidgetStyles}>
      {statusResult && (
        <>
          {Object.keys(statusResult).map((statusKey) =>
            statusKey === 'nodeEnvMode' ? (
              <p key={statusKey}>
                {statusKey}: {statusResult[statusKey]}
              </p>
            ) : (
              <p key={statusKey}>
                <BsCheckCircleFill /> {statusKey}
              </p>
            )
          )}
        </>
      )}
    </div>
  );
};

export default StatusWidget;
