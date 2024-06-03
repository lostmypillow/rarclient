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





// function DeleteCardButton({ cardValue, onDelete }) {
//   const handleDelete = () => {
//     fetch(`http://localhost:8000/api/cards/${cardValue}`, {
//       method: 'DELETE',
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.success) {
//           onDelete();
//           Refresh() // Call the onDelete callback to update the UI
//         } else {
//           console.error('Failed to delete card:', cardValue);
//         }
//       })
//       .catch(error => console.error('Error deleting card:', error));
//   };

//   return (
//     <Button variant="contained" color="error" onClick={handleDelete}>
//       Delete Card
//     </Button>
//   );
// }


function Left({ onDelete }) {
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cardList, setCardList] = useState([]);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      fetch('http://localhost:8000/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "card_val": inputValue.trim() }),
      })
        .then(response => response.json())
        .then(data => {
          setCardList(prevList => [...prevList, data.card]);
          setInputValue('');
          Refresh()
        })
        .catch(error => console.error('Error adding card:', error));
    }
  };
 function handleDelete(e) {
    fetch(`http://localhost:8000/api/cards/${e.target.id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
        
          Refresh() // Call the onDelete callback to update the UI
        } else {
          console.error('Failed to delete card:', cardValue);
        }
      })
      .catch(error => console.error('Error deleting card:', error));
  };
  async function Refresh() {
    fetch('http://localhost:8000/api/cards')
      .then(response => response.json())
      .then(data => {

        setCardList(data)
        console.log(cardList)
      })
      .catch(error => console.error('Error fetching card list:', error));
  }

  useEffect(() => {
    fetch('http://localhost:8000/api/attempts/total')
      .then(response => response.json())
      .then(data => setTotalAttempts(data.total_attempts))
      .catch(error => console.error('Error fetching total attempts:', error));

    fetch('http://localhost:8000/api/attempts/today')
      .then(response => response.json())
      .then(data => setAttemptsToday(data.total_attempts))
      .catch(error => console.error('Error fetching attempts today:', error));

    fetch('http://localhost:8000/api/cards')
      .then(response => response.json())
      .then(data => {

        setCardList(data)
        console.log(cardList)
      })
      .catch(error => console.error('Error fetching card list:', error));





  }, []);
  return (
    <><div className='flex flex-row items-center justify-between gap-6 basis-1/3'>
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

      <Card variant='outlined' className='flex flex-col gap-2 w-[50%] border-2 border-black px-4 py-2'>
        <CardContent className='flex flex-col gap-4'>
          <List
            component="nav"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                List of Allowed IDs
              </ListSubheader>
            }
          >

            {cardList.map((item, index) => (

              <ListItem key={index}>
                <ListItemText primary={item.card_val} />
                <Button id={item.card_val} variant="contained" color="error" onClick={handleDelete}>Delete</Button>
              </ListItem>
            ))}
          </List>

          <TextField type="text"
            value={inputValue}
            onChange={handleInputChange} id="filled-basic" variant="filled" label="Add a new item" className='w-full' />
        </CardContent>
        <CardActions>
          <Button size='large' variant='contained' className='w-full' onClick={handleAddItem}>Add</Button>
      
        </CardActions>
      </Card>


    </div></>
  )
}
function BottomLeft() {
  return (
    <></>
  )
}

function Right({ monthlySummary }) {
  const { xAxis, successful, failed } = monthlySummary;
  return (
    <> <div className='flex items-center justify-center basis-2/3'>

      <Stack sx={{ width: '100%', height: '100%' }}>

        <LineChart
          xAxis={[{ data: xAxis }]}
          series={[
            {
              data: successful,
            },
            {
              data: failed,

            },
          ]}
          height={400}
          margin={{ top: 10, bottom: 20 }}
          // skipAnimation
          grid={{ vertical: true, horizontal: true }}
        />
      </Stack>

    </div></>
  )
}


function App() {

  const [monthlySummary, setMonthlySummary] = useState({ xAxis: [], successful: [], failed: [] });
  useEffect(() => {
    fetch('http://localhost:8000/api/attempts/monthly_summary')
      .then(response => response.json())
      .then(data => setMonthlySummary(data))
      .catch(error => console.error('Error fetching monthly summary:', error));
  }, [])
  return (
    <>
      <div className='flex flex-col w-svw h-svh p-8'>
        <Left />
        <Right monthlySummary={monthlySummary} />

      </div>

    </>
  )
}

export default App
