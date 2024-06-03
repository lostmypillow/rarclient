import { useState, useEffect } from 'react'

import './App.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';



function ListAdder() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (

    <>
      <Card variant='outlined' className='flex flex-col gap-4 w-full border-2 border-black'>
        <CardContent className='flex flex-col gap-4'>
          <List
            component="nav"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                List of Allowed IDs
              </ListSubheader>
            }
          >

            {items.map((item, index) => (

              <ListItemButton>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>

          <TextField type="text"
            value={inputValue}
            onChange={handleInputChange} id="filled-basic" variant="filled" label="Add a new item" className='w-full' />
        </CardContent>
        <CardActions>
          <Button size='large' className='w-full' variant='contained' onClick={handleAddItem}>Add</Button>
        </CardActions>
      </Card>


    </>
  );
};



function Left() {
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [attemptsToday, setAttemptsToday] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/attempts/total', { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => setTotalAttempts(data.total_attempts))
      .catch(error => console.error('Error fetching total attempts:', error));

    fetch('http://localhost:8000/api/attempts/today', { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => setAttemptsToday(data.total_attempts))
      .catch(error => console.error('Error fetching attempts today:', error));
  }, []);
  return (
    <><div className='flex flex-col items-center justify-between gap-6 basis-1/3'>
      <Stack spacing={2} direction="row">
        <Button variant="contained" size="large">
          <div className='text-3xl'>
            總請求數: {totalAttempts}
          </div>
        </Button>
        <Button variant="contained" color="success" size="large">
          <div className='text-3xl'>
            今天請求數: {attemptsToday}
          </div>
        </Button>
      </Stack>

      <ListAdder />

    </div></>
  )
}
function BottomLeft() {
  return (
    <></>
  )
}

function Right() {

  return (
    <> <div className='flex items-center justify-center basis-2/3'>

      <Stack sx={{ width: '100%', height: '100%' }}>

        <LineChart
          xAxis={[{ data: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3] }]}
          series={[
            {
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            },
            {
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

            },
          ]}
          height={200}
          margin={{ top: 10, bottom: 20 }}
          skipAnimation
        />
      </Stack>

    </div></>
  )
}


function App() {


  return (
    <>
      <div className='flex flex-row w-svw h-svh'>
        <Left />
        <Right />

      </div>

    </>
  )
}

export default App
