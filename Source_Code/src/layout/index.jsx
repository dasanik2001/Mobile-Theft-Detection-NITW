import { Box } from "@mui/material";
// import Sidebar from "../components/sidebar";


const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#10141F",
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        color: "white",
        padding: 3,
        gap: 3,
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      {/* <Sidebar /> */}
      <Box
        sx={{
          width: "100%",
          overflowY: "scroll",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
