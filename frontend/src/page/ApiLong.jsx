import { useNavigate } from "react-router-dom";
import useFetchData from "../hook/useFetchData";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box,
  Grid2,
  TableCell,
  Typography,
  CircularProgress,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";
import { ThresholdInput, TimeRangeInput } from "../component/Input";
import { SubmitButtons } from "../component/Common";
import dayjs from "dayjs";

import CustomContainer from "../component/CustomContainer";
import { useState } from "react";

const ApiLong = () => {
  const navigate = useNavigate();
  const { data, error, loading, fetchData } = useFetchData(
    "/api-statistics/long"
  );
  const methods = useForm({
    defaultValues: {
      threshold: null,
      from: null,
      to: null,
    },
  });
  const [pg, setPg] = useState(0);
  const [rpg, setRpg] = useState(5);
  const onSubmit = async (data) => {
    setPg(0);
    const params = {
      ...data,
      from: data.from?.$d.getTime() || dayjs().startOf("day").valueOf(),
      to:
        data.to?.$d.getTime() || dayjs().startOf("day").add(1, "day").valueOf(),
    };
    await fetchData(params);
  };
  let sortedData = null;
  if (data) {
    sortedData = data.sort((a, b) => b.count - a.count);
  }
  return (
    <Box>
      <Typography variant="h5">View API exceed latency threshold</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <TimeRangeInput />
            <ThresholdInput label={"Latency (microseconds)"} />
            <SubmitButtons />
          </Grid2>
        </form>
      </FormProvider>
      {loading && <CircularProgress />}
      {error && <div>{error.message}</div>}
      {sortedData ? (
        <CustomContainer>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Exceed count</TableCell>
                  <TableCell>Avg latency (miliseconds)</TableCell>
                  <TableCell>Avg latency (seconds)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData
                  .slice(pg * rpg, pg * rpg + rpg)
                  .map(({ _id: api, count, avg_latency }, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() =>
                        navigate(
                          `/api-statistic?service_name=${api.service_name}&endpoint=${api.endpoint}&method=${api.method}`
                        )
                      }
                    >
                      <TableCell>{api.service_name}</TableCell>
                      <TableCell>{api.endpoint}</TableCell>
                      <TableCell>{api.method}</TableCell>
                      <TableCell>{count}</TableCell>
                      <TableCell>{(avg_latency / 1000).toFixed(0)}</TableCell>
                      <TableCell>
                        {(avg_latency / 1000000).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            count={sortedData.length}
            onPageChange={(e, pg) => setPg(pg)}
            onRowsPerPageChange={(e) => setRpg(parseInt(e.target.value, 10))}
            page={pg}
            rowsPerPage={rpg}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </CustomContainer>
      ) : (
        <Typography variant="h5">No data</Typography>
      )}
    </Box>
  );
};

export default ApiLong;
