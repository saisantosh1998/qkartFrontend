import { Search } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Button,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({
 children,hasHiddenAuthButtons
}) => {
  // const [searchValue, setSearchValue] = useState("");
  const history = useHistory();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  // const updateChildProps = (value) => {
  //   setSearchValue(value);
  // };
  const callParentFunc = (e) => {
    children[3](e);
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children ? (
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={children[1]}
          onChange={callParentFunc}
        />
      ) : null}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : username && token ? (
        <Stack direction="row" spacing={2}>
          <Avatar src="avatar.png" alt={username} />
          <p> {username}</p>
          <Button
            name="logout"
            id="logout"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Box>
          <Button onClick={() => history.push("/login")}>LOGIN</Button>
          <Button onClick={() => history.push("/register")} variant="contained">
            REGISTER
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
