import { Button, TextField, Box } from '@material-ui/core';
import axios from 'axios'; // tslint:disable-line match-default-export-name
import React, { useState } from 'react';

interface Props {}

const Login: React.FC<Props> = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form
      onSubmit={e => {
        axios.post('/api/login', {
          username,
          password,
        });

        e.preventDefault(); // Don't reload the page
      }}
    >
      <Box display="flex" flexDirection="column">
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={e => {
            setUsername(e.currentTarget.value);
          }}
        />
        <TextField
          id="username"
          label="Password"
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.currentTarget.value);
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!username || !password}
        >
          Log In
        </Button>
      </Box>
    </form>
  );
};

export default Login;
