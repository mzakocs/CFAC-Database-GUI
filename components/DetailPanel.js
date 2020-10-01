import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";

const DetailPanel = ({ rowData, setData, ...props }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  return (
    <div>
      <ul>
        {rowData.log.map((logEntry) => (
          <li key={rowData.num.toString() + logEntry.num.toString()}>
            {logEntry.status +
              (logEntry.source === "None" ? "" : " - " + logEntry.source)}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setDialogOpen(true);
          console.log(dialogOpen);
        }}
        style={{ margin: "5px 10px" }}
      >
        Add
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>
          Add to Log of Calculator #{rowData.num.toString()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add to the log of this calculator.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="status"
            label="Status"
            onChange={(event) => {
              setStatus(event.target.value);
              console.log(status)
            }}
            fullWidth
          />
          <TextField
            margin="dense"
            id="source"
            label="Source"
            onChange={(event) => {
              setSource(event.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Changes the rowdata
              let newData = rowData;
              // Appends the new log entry
              newData.log.push({
                num: rowData.log.length + 1,
                type: "Log",
                status: status,
                source: source || "None",
                date: new Date(new Date().toLocaleDateString()),
              });
              // Clones the object and removes the tableData sector
              let newDBData = {};
              Object.keys(newData).forEach((dataKey) => {
                if (dataKey !== "tableData") {
                  newDBData[dataKey] = newData[dataKey];
                }
              });
              try {
                axios.patch("/api/calculators", newDBData).then((response) => {
                  setData((prevState) => {
                    const data = [...prevState];
                    data[data.indexOf(rowData)] = newData;
                    return data;
                  });
                  setDialogOpen(false);
                });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailPanel;
