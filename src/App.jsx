import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import { LineChart } from '@mui/x-charts/LineChart';


function GitHubIcon() {
  return (
    <>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-github">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
        </path>
      </svg>
    
    </>
  )
}


function Title() {
  return (
    <>
       <div className='flex flex-row items-center justify-between w-full h-14'>
        <h1 className='text-3xl md:text-4xl font-bold'>
          RAR Client
        </h1>
      
      <Button variant='outlined' color='secondary' size='large' startIcon={<GitHubIcon />}>  GitHub</Button>
      
      </div>

    
    </>
  )
}

function Top() {
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [cardList, setCardList] = useState([]);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  async function handleAddItem() {
    if (inputValue.trim()) {
      fetch('https://rarserver.lostmypillow.duckdns.org/api/card', {
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
  async function handleDelete(e) {
    fetch(`https://rarserver.lostmypillow.duckdns.org/api/cards/${e.target.id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Refresh()
        } else {
          console.error('Failed to delete card:', cardValue);
        }
      })
      .catch(error => console.error('Error deleting card:', error));
  };
  async function Refresh() {
    fetch('https://rarserver.lostmypillow.duckdns.org/api/cards')
      .then(response => response.json())
      .then(data => {
        setCardList(data)
        console.log(cardList)
      })
      .catch(error => console.error('Error fetching card list:', error));
  }

  useEffect(() => {
    fetch('https://rarserver.lostmypillow.duckdns.org/api/attempts/total')
      .then(response => response.json())
      .then(data => setTotalAttempts(data.total_attempts))
      .catch(error => console.error('Error fetching total attempts:', error));

    fetch('https://rarserver.lostmypillow.duckdns.org/api/attempts/today')
      .then(response => response.json())
      .then(data => setAttemptsToday(data.total_attempts))
      .catch(error => console.error('Error fetching attempts today:', error));

    fetch('https://rarserver.lostmypillow.duckdns.org/api/cards')
      .then(response => response.json())
      .then(data => {

        setCardList(data)
        console.log(cardList)
      })
      .catch(error => console.error('Error fetching card list:', error));


  }, []);
  return (
    <><div className='flex flex-col md:flex-row items-center justify-between gap-6 basis-1/3'>
   
      <div className='flex flex-row md:flex-col gap-4 w-full md:w-[50%] h-[15%] md:h-full'>
        <Button variant="contained" size="large" disableElevation className='w-full h-full'>
          <div className='text-3xl md:text-6xl'>
            總請求數: {totalAttempts}
          </div>
        </Button>
        <Button variant="contained" color="success" size="large" disableElevation className='w-full h-full'>
          <div className='text-3xl md:text-6xl'>
            今天請求數: {attemptsToday}
          </div>
        </Button>
      </div>

      <Card variant='outlined' className='flex flex-col gap-2 w-full md:w-[50%] border-2 border-black px-4 py-2'>
        <CardContent className='flex flex-col gap-4'>
          <List component="nav" subheader=
            {
              <ListSubheader component="div" id="nested-list-subheader">
                List of Allowed IDs
              </ListSubheader>
            }>
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
          <Button size='large' variant='contained' className='w-full' onClick={handleAddItem}>
            Add
          </Button>
        </CardActions>
      </Card>

    </div></>
  )
}


function Bottom({ monthlySummary }) {
  const { xAxis, successful, failed } = monthlySummary;
  return (
    <div className='flex items-center justify-center basis-2/3 w-full h-full'>

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

    </div>
  )
}


function App() {

  const [monthlySummary, setMonthlySummary] = useState({ xAxis: [], successful: [], failed: [] });

  useEffect(() => {
    fetch('https://rarserver.lostmypillow.duckdns.org/api/attempts/monthly_summary')
      .then(response => response.json())
      .then(data => setMonthlySummary(data))
      .catch(error => console.error('Error fetching monthly summary:', error));
  }, [])

  return (
    <div className='flex flex-col w-svw h-svh p-8 gap-4'>
      <Title />
      <Top />
      <Bottom monthlySummary={monthlySummary} />
    </div>
  )
}

export default App
