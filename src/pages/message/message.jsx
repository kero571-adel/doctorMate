import { Box, Button, Stack, Typography } from "@mui/material";
import NavBar from "../../components/navBar";
import { Phone, Search } from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { useEffect, useState } from "react";
const Searched = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  marginLeft: 0,
  width: "184px",
}));
let patient = [
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.Got it.Thank youGot it.Thank youGot it.Thank youGot it.Thank youGot it.Thank youGot it.Thank you",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
  {
    img: "/assets/message/Ellipse 145.png",
    name: "Aamir",
    mess: "Got it.Thank you.",
    time: "18 Jul",
  },
];
let chat = [
  {
    msgFrom: "doc",
    msg: "Hello, how are you feeling today?",
    time: "2:30pm",
  },
  {
    msgFrom: "pat",
    msg: "Doctor, I have a headache for two days.",
    time: "2:32pm",
  },
  {
    msgFrom: "doc",
    msg: "Hello, how are you feeling today?",
    time: "2:30pm",
  },
  {
    msgFrom: "pat",
    msg: "Doctor, I have a headache for two days.Doctor, I have a headache for two days.Doctor, I have a headache for two days.Doctor, I have a headache for two days.Doctor, I have a headache for two days.Doctor, I have a headache for two days.",
    time: "2:32pm",
  },
  {
    msgFrom: "doc",
    msg: "Hello, how are you feeling today?",
    time: "2:30pm",
  },
  {
    msgFrom: "pat",
    msg: "Doctor, I have a headache for two days.",
    time: "2:32pm",
  },
  {
    msgFrom: "doc",
    msg: "Hello, how are you feeling today?",
    time: "2:30pm",
  },
  {
    msgFrom: "pat",
    msg: "Doctor, I have a headache for two days.",
    time: "2:32pm",
  },
  {
    msgFrom: "doc",
    msg: "Hello, how are you feeling today?",
    time: "2:30pm",
  },
  {
    msgFrom: "pat",
    msg: "Doctor, I have a headache for two days.",
    time: "2:32pm",
  },
];
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
export default function Message() {
  const [activeChat, setactiveChat] = useState(0);
  let [pat, setPat] = useState(patient);
  let [search, setSearch] = useState("");
  useEffect(() => {
    setTimeout(() => {
      if (search == "") {
        setPat(patient);
      } else {
        setPat(
          patient.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }, 2000);
  }, [search]);
  return (
    <Stack direction="row">
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: "20px",
          height: "100vh",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/** Header */}
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
            Messages
          </Typography>
          <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
            <Box>
              <Search />
            </Box>
            <Box sx={{ position: "relative" }}>
              <ChatBubbleOutlineIcon />
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -5,
                  right: -3,
                  backgroundColor: "primary.main",
                  color: "white",
                  width: "13px",
                  height: "13px",
                  borderRadius: "5px",
                  fontWeight: "600",
                  fontSize: "8px",
                }}
              >
                4
              </Stack>
            </Box>
            <Box sx={{ position: "relative" }}>
              <NotificationsNoneIcon />
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -3,
                  right: -1,
                  backgroundColor: "primary.main",
                  color: "white",
                  width: "13px",
                  height: "13px",
                  borderRadius: "5px",
                  fontWeight: "600",
                  fontSize: "8px",
                }}
              >
                2
              </Stack>
            </Box>
            <img src="/assets/message/Frame 1000005779.png" alt="" />
          </Stack>
        </Stack>
        {/** Main Card */}
        <Box
          sx={{
            backgroundColor: "#9CE3CA",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          {/**header mainCard */}
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              padding: "21px 22px",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0px 4px 4px #00000040",
            }}
          >
            <Searched>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ "aria-label": "search" }}
              />
            </Searched>
            <Stack direction={"row"} spacing={2}>
              <img src="/assets/message/Ellipse 146 (2).png" alt="" />
              <Typography sx={{ fontSize: "24px", fontWeight: "400" }}>
                Hazem wagih
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              spacing={3}
              fontSize={"20px"}
              fontWeight={"500"}
            >
              <Button color="black">
                Call
                <Phone sx={{ ml: 1 }} />
              </Button>
              <Button color="black">
                Files
                <FolderCopyIcon sx={{ ml: 1 }} />
              </Button>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            sx={{
              backgroundColor: "#0EBE7E4D",
              borderRadius: "0 0 20px 20px",
              height: "689px",
            }}
          >
            <Stack
              direction={"column"}
              sx={{
                width: "30%",
                overflowY: "auto",
                padding: "10px",
                "&::-webkit-scrollbar": {
                  width: "2px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray",
                  borderRadius: "10px",
                },
              }}
            >
              {pat.map((item, index) => (
                <Stack
                  key={index}
                  onClick={() => setactiveChat(index)}
                  direction="row"
                  spacing={1}
                  sx={{
                    backgroundColor: activeChat === index ? "primary.main" : "",
                    color: activeChat === index ? "white" : "",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    height: "70px",
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ minWidth: 0 }}>
                    <img
                      src={item.img}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                        {item.name}
                      </Typography>

                      <Typography
                        noWrap
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.mess}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.time}
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Box
              sx={{
                width: "70%",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "2px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray",
                  borderRadius: "10px",
                },
              }}
            >
              {chat.map((item, index) => (
                <Stack
                  direction="row"
                  sx={{
                    justifyContent:
                      item.msgFrom === "pat" ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                  key={index}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        item.msgFrom === "doc" ? "primary.main" : "#D9D9D9",
                      width: "fit-content",
                      padding: "10px 10px 20px",
                      borderRadius: "20px",
                      margin: "10px",
                      maxWidth: "60%",
                      position: "relative",
                    }}
                  >
                    {item.msg}
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: "2px",
                        right: "10px",
                        color: "#616161",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {item.time}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
