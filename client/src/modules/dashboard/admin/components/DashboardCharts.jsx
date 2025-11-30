import { Grid, Card, CardContent, Typography } from "@mui/material";
import PieChartIssues from "./PieChartIssues";
import BarChartStatus from "./BarChartStatus";
import LineChartGrowth from "./LineChartGrowth";

export default function DashboardCharts({ issues }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 3,
            background: (theme) => theme.palette.background.glass,
            boxShadow: (theme) => theme.shadows[4],
            transition: "0.3s",
            "&:hover": {
              boxShadow: (theme) => theme.shadows[8],
              transform: "translateY(-3px)",
            },
          }}>
          <CardContent sx={{ px: 3, py: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Category Distribution
            </Typography>
            <PieChartIssues issues={issues} />
          </CardContent>
        </Card>
      </Grid>

      {/* Line Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 3,
            background: (theme) => theme.palette.background.glass,
            boxShadow: (theme) => theme.shadows[4],
            transition: "0.3s",
            "&:hover": {
              boxShadow: (theme) => theme.shadows[8],
              transform: "translateY(-3px)",
            },
          }}>
          <CardContent sx={{ px: 3, py: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Issue Growth Over Time
            </Typography>
            <LineChartGrowth issues={issues} />
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart */}
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 3,
            background: (theme) => theme.palette.background.glass,
            boxShadow: (theme) => theme.shadows[4],
            transition: "0.3s",
            "&:hover": {
              boxShadow: (theme) => theme.shadows[8],
              transform: "translateY(-3px)",
            },
          }}>
          <CardContent sx={{ px: 3, py: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Status Overview
            </Typography>
            <BarChartStatus issues={issues} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// import { Grid, Card, CardContent } from "@mui/material";
// import PieChartIssues from "./PieChartIssues";
// import BarChartStatus from "./BarChartStatus";
// import LineChartGrowth from "./LineChartGrowth";

// export default function DashboardCharts({ issues }) {
//   return (
//     <Grid container spacing={3} sx={{ mb: 4 }}>
//       {/* Pie Chart */}
//       <Grid item xs={12} md={6}>
//         <Card
//           sx={{
//             borderRadius: 3,
//             background: (theme) => theme.palette.background.glass,
//             boxShadow: (theme) => theme.shadows[4],
//           }}>
//           <CardContent>
//             <PieChartIssues issues={issues} />
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* Line Chart */}
//       <Grid item xs={12} md={6}>
//         <Card
//           sx={{
//             borderRadius: 3,
//             background: (theme) => theme.palette.background.glass,
//             boxShadow: (theme) => theme.shadows[4],
//           }}>
//           <CardContent>
//             <LineChartGrowth issues={issues} />
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* Bar Chart */}
//       <Grid item xs={12}>
//         <Card
//           sx={{
//             borderRadius: 3,
//             background: (theme) => theme.palette.background.glass,
//             boxShadow: (theme) => theme.shadows[4],
//           }}>
//           <CardContent>
//             <BarChartStatus issues={issues} />
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }
