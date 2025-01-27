import { useLocation } from "react-router-dom";
import { ApiStatisticDefault } from "../config/default";
import { FormProvider, useForm } from "react-hook-form";
import useFetchData from "../hook/useFetchData";
import { useEffect } from "react";
import {
  Accordion,
  CircularProgress,
  AccordionDetails,
  Paper,
  TableHead,
  AccordionSummary,
  Box,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import {
  EndpointInput,
  MethodInput,
  ServiceNameInput,
  TimeRangeInput,
  TimeUnitInput,
} from "../component/Input";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import dayjs from "dayjs";
import axios from "../config/axios";
import { useState } from "react";
import { StatCard } from "../component/StatCard";
import { SubmitButtons } from "../component/Common";
import CustomContainer from "../component/CustomContainer";
import { BarChartCard } from "../component/BarChartCard";
import { BarChart } from "@mui/x-charts";

function ApiStatistic({ defaultValue = ApiStatisticDefault }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const methods = useForm({
    defaultValues: {
      service_name: params.get("service_name"),
      endpoint: params.get("endpoint"),
      method: params.get("method"),
      unit: "hour",
    },
  });

  const apiFetcher = useFetchData("/api-statistics");
  const [endpoints, setEndpoints] = useState([]);
  const serviceName = methods.watch("service_name");

  const fetchEndpointsFromService = async (service) => {
    try {
      const res = await axios.get(`/services/${service}/endpoints`);
      setEndpoints(["", ...res.data]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (serviceName) {
      fetchEndpointsFromService(serviceName);
    }
  }, [serviceName]);
  const onSubmit = async (data) => {
    apiFetcher.fetchData({
      ...defaultValue,
      ...data,
      from: data.from?.$d.getTime() || dayjs().startOf("day").valueOf(),
      to:
        data.to?.$d.getTime() || dayjs().startOf("day").add(1, "day").valueOf(),
    });
  };
  const labels = Object.keys(apiFetcher.data?.Distribution || {}).map((item) =>
    new Date(parseInt(item)).toLocaleString()
  );
  const counts = Object.values(apiFetcher.data?.Distribution || {});
  const errCounts = Object.values(apiFetcher.data?.ErrorDistTime || {});
  return (
    <Box>
      <Typography variant="h5">API Statistic</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid2 container="true" spacing={2}>
            <ServiceNameInput />
            <EndpointInput endpoints={endpoints} />
            <MethodInput />
            <TimeUnitInput />
            <TimeRangeInput />
            <SubmitButtons />
          </Grid2>
        </form>
      </FormProvider>
      {apiFetcher.loading && <CircularProgress />}
      {apiFetcher.error && (
        <Typography color="error">{apiFetcher.error}</Typography>
      )}
      {apiFetcher.data ? (
        <Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              View overall
            </AccordionSummary>
            <AccordionDetails>
              <CustomContainer title="Overall">
                <Grid2 container="true" spacing={2}>
                  <StatCard
                    title="Count"
                    value={apiFetcher.data.Count}
                    unit="calls"
                  />
                  <StatCard
                    title="Frequency"
                    value={apiFetcher.data.Frequency}
                    unit={`calls/${methods.getValue("unit")}`}
                  />
                  <BarChartCard
                    title="Distribution"
                    caption="Distribution of API calls"
                  >
                    <BarChart
                      width={500}
                      height={300}
                      xAxis={[
                        {
                          scaleType: "band",
                          data: labels,
                          labels: "Timestamp",
                          tickPlacement: "start",
                          tickLabelPlacement: "tick",
                        },
                      ]}
                      series={[{ data: counts, label: "Count" }]}
                    />
                  </BarChartCard>
                </Grid2>
              </CustomContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              View latency
            </AccordionSummary>
            <AccordionDetails>
              <CustomContainer title="Latency">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell>Value (microsecond)</TableCell>
                        <TableCell>Value (milisecond)</TableCell>
                        <TableCell>Value (second)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(apiFetcher.data.Latency).map(
                        ([key, value], index) => (
                          <TableRow key={index}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{value}</TableCell>
                            <TableCell>{value / 1000}</TableCell>
                            <TableCell>{value / 1000000}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              View error
            </AccordionSummary>
            <AccordionDetails>
              <CustomContainer title="Error">
                <Grid2 container="true" spacing={2}>
                  <StatCard
                    title="Error Count"
                    value={apiFetcher.data.ErrorCount}
                    unit="errors"
                  />
                  <StatCard
                    title="Error Rate"
                    value={apiFetcher.data.ErrorRate * 100}
                    unit={"%"}
                  />
                  <BarChartCard
                    title="Error Distribution"
                    caption="Distribution of API errors"
                  >
                    <BarChart
                      width={500}
                      height={300}
                      xAxis={{
                        scaleType: "band",
                        data: labels,
                        labels: "Timestamp",
                        tickPlacement: "start",
                        tickLabelPlacement: "tick",
                      }}
                      series={[{ data: errCounts, label: "Count" }]}
                    />
                  </BarChartCard>
                  <BarChartCard title="" caption="Errors by status code">
                    <BarChart
                      width={500}
                      height={300}
                      xAxis={{
                        scaleType: "band",
                        data: Object.keys(apiFetcher.data.ErrorDist || {}),
                        labels: "Status Code",
                      }}
                      series={[
                        {
                          data: Object.values(apiFetcher.data.ErrorDist || {}),
                          label: "Count",
                        },
                      ]}
                    />
                  </BarChartCard>
                </Grid2>
              </CustomContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
      ) : (
        <Typography variant="h6">No data</Typography>
      )}
    </Box>
  );
}

export default ApiStatistic;
