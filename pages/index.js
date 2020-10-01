import React, { useState, useEffect } from "react";
import Head from "next/head";
import MaterialTable, { MTableEditRow } from "material-table";
import {
  Typography,
} from "@material-ui/core";
import tableIcons from "../theme/TableIcons";
import axios from "axios";
import Loader from "react-loader-spinner";
import DetailPanel from "../components/DetailPanel";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  console.log(data)
  useEffect(() => {
    // Loads the data using axios
    async function fetchData() {
      try {
        const response = await axios.get("/api/calculators");
        setData(response.data.calculators);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [isLoaded]);
  return (
    <div className={"container"}>
      <Head>
        <title>CFAC-DB-GUI</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      {isError && <p>Something Went Wrong!</p>}
      {!isLoaded && (
        <Loader
          type="BallTriangle"
          color="#00BFFF"
          height={80}
          width={80}
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "50px",
          }}
        />
      )}
      {isLoaded && (
        <MaterialTable
          style={{ borderRadius: "0px", width: "100%" }}
          icons={tableIcons}
          title={<Typography variant="h4">Calculators</Typography>}
          options={{
            rowStyle: {
              fontFamily: "Roboto",
            },
            actionsColumnIndex: -1,
          }}
          detailPanel={(rowData) => <DetailPanel rowData={rowData} setData={setData}/>}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                try {
                  axios.post("/api/calculators", newData).then((response) => {
                    resolve();
                    setData((prevState) => {
                      const data = [...prevState];
                      data.unshift(response.data);
                      return data;
                    });
                  });
                } catch (error) {
                  console.error(error);
                  setIsError(true);
                }
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                try {
                  axios.patch("/api/calculators", newData).then((response) => {
                    resolve();
                    setData((prevState) => {
                      const data = [...prevState];
                      data[data.indexOf(oldData)] = response.data;
                      return data;
                    });
                  });
                } catch (error) {
                  console.log(error);
                  setIsError(true);
                }
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                console.log(oldData);
                try {
                  axios
                    .delete("/api/calculators", {
                      params: { _id: oldData._id },
                    })
                    .then((response) => {
                      resolve();
                      setData((prevState) => {
                        const data = [...prevState];
                        data.splice(data.indexOf(oldData), 1);
                        return data;
                      });
                    });
                } catch (error) {
                  console.log(error);
                  setIsError(true);
                }
              }),
          }}
          components={{
            EditRow: (tableProps) => {
              return (
                <MTableEditRow
                  {...{
                    ...tableProps,
                    onBulkEditRowChanged:
                      typeof tableProps.onBulkEditRowChanged === "function"
                        ? tableProps.onBulkEditRowChanged
                        : () => {},
                  }}
                />
              );
            },
          }}
          data={data}
          columns={[
            {
              title: "Number",
              field: "num",
              type: "numeric",
              align: "center",
              editable: false,
            },
            {
              title: "Type",
              field: "type",
              align: "center",
            },
            {
              title: "Source",
              field: "source",
              align: "center",
            },
            {
              title: "Status",
              field: "status",
              align: "center",
              lookup: {
                ready: "Ready For Donation",
                forparts: "Used For Parts",
                repair: "Currently Being Repaired",
                donated: "Donated to a School",
              },
            },
            {
              title: "Date Added",
              field: "date",
              align: "right",
              type: "date",
              // editable: false,
              render: (rowData) => {
                new Date(rowData.date).toLocaleDateString();
              },
            },
          ]}
        />
      )}
    </div>
  );
}
