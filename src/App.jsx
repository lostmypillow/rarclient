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
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

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


function Status({ totalAttempts, attemptsToday }) {



  return (
    <>
      <List className='w-full md:w-[50%] h-[15%] md:h-full' >

        <ListSubheader>
          Status
        </ListSubheader>

        <ListItem className='md:text-4xl'>
          總請求數: {totalAttempts}
        </ListItem>


        <ListItem className='md:text-4xl'>
          今天請求數: {attemptsToday}
        </ListItem>
      </List>
    </>
  )
}




function AllowedIDs({ cardList, onAdd, onDelete, onInputChange }) {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    onInputChange(event.target.value)
  };

  return (
    <>
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
                <Button id={item.card_val} variant="contained" color="error" onClick={onDelete} startIcon={<DeleteIcon />} >Delete</Button>
              </ListItem>
            ))}
          </List>
          <TextField type="text"
            value={inputValue}
            onChange={handleInputChange} id="filled-basic" variant="filled" label="Add a new item" className='w-full' />
        </CardContent>
        <CardActions>
          <Button size='large' variant='contained' className='w-full' onClick={onAdd} startIcon={<AddIcon />}>
            Add
          </Button>
        </CardActions>
      </Card>

    </>
  )
}


function Graph({ monthlySummary }) {
  const { xAxis, successful, failed } = monthlySummary;
  return (
    <div className='flex items-center justify-center basis-2/3 w-full h-full m-5'>
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
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  )
}





function App() {
  const [inputValue, setInputValue] = useState('');
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [monthlySummary, setMonthlySummary] = useState({ xAxis: [], successful: [], failed: [] });
  const [cardList, setCardList] = useState([]);

  async function GetTotalAttempts() {
    await fetch('https://rarserver.onrender.com/api/attempts/total')
      .then(response => response.json())
      .then(data => setTotalAttempts(data.total_attempts))
      .catch(error => console.error('Error fetching total attempts:', error));


  }
  async function GetAttemptsToday() {
    await fetch('https://rarserver.onrender.com/api/attempts/today')
      .then(response => response.json())
      .then(data => setAttemptsToday(data.total_attempts))
      .catch(error => console.error('Error fetching attempts today:', error));
  }
  async function GetMonthlySummary() {
    await fetch('https://rarserver.onrender.com/api/attempts/monthly_summary')
      .then(response => response.json())
      .then(data => setMonthlySummary(data))
      .catch(error => console.error('Error fetching monthly summary:', error));
  }
  async function GetCardList() {


    await fetch('https://rarserver.onrender.com/api/cards')
      .then(response => response.json())
      .then(data => {
        setCardList(data)
      })
      .catch(error => console.error('Error fetching card list:', error));

  }
  async function handleAddItem() {
    if (inputValue.trim()) {
      await fetch('https://rarserver.onrender.com/api/card', {
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
    await fetch(`https://rarserver.onrender.com/api/cards/${e.target.id}`, {
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
  function handleInput(value) {
    setInputValue(value)
  }

const [isLoading, setIsLoading] = useState(false)
  async function Refresh() {
    setIsLoading(true)
    await GetMonthlySummary()
    await GetTotalAttempts()
    await GetAttemptsToday()
    await GetCardList()
    setIsLoading(false)
    console.log("refreshed")
  }


  useEffect(() => {
    Refresh()
  }, [])

  return (
    <div className='flex flex-col w-svw h-svh p-8 gap-4'>
      <Title />
      <Button variant='outlined' size='large' onClick={Refresh} startIcon={isLoading? <CircularProgress size={22} /> : <RefreshIcon />} >Refresh All</Button>
      <div className='flex flex-col md:flex-row items-center justify-between gap-6 basis-1/3'>
        <Status
          totalAttempts={totalAttempts}
          attemptsToday={attemptsToday} />
        <AllowedIDs cardList={cardList} onAdd={handleAddItem} onDelete={handleDelete} onInputChange={handleInput} />

      </div>
      <Graph monthlySummary={monthlySummary} />
    </div>
  )
}

export default App
