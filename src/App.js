import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const STATUS = ['Todo', 'Backlog', 'In Progress', 'Done', 'Cancelled'];
const PRIORITY_LABELS = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority'
};
const USER_OPTIONS = {
  'usr-1': "Anoop sharma",
  'usr-2': "Yogesh",
  'usr-3': "Shankar Kumar",
  'usr-4': "Ramesh",
  'usr-5': "Suresh"
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('By Status');
  const [sortingOption, setSortingOption] = useState('Priority');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const getUsername = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  const getUserAvailability = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? (user.available ? 'True' : 'False') : 'Unknown';
  };


  const getGroupCardCount = (group) => {
    return sortedTickets[group].length;
  };
  const groupedTickets = {};

  if (groupingOption === 'By Status') {
    STATUS.forEach(status => {
      groupedTickets[status] = tickets.filter(ticket => ticket.status === status);
    });
  } else if (groupingOption === 'By Priority') {
    Object.keys(PRIORITY_LABELS).forEach(priority => {
      groupedTickets[PRIORITY_LABELS[priority]] = tickets.filter(ticket => ticket.priority === parseInt(priority));
    });
  }
  else if (groupingOption === 'By User') {

    Object.keys(USER_OPTIONS).forEach(user => {
      groupedTickets[USER_OPTIONS[user]] = tickets.filter(ticket => ticket.userId === user);
    })
  }

  const sortedTickets = Object.keys(groupedTickets).reduce((sorted, group) => {
    sorted[group] = groupedTickets[group].sort((a, b) => {
      if (sortingOption === 'Priority') {
        return b.priority - a.priority;
      } else if (sortingOption === 'Title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    return sorted;
  }, {});

  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Dropdowns">
          <div className="Dropdown">
            <label>Grouping: </label>
            <select onChange={handleGroupingChange} value={groupingOption}>
              <option>By Status</option>
              <option>By Priority</option>
              <option>By User</option>
            </select>
          </div>
          <div className="Dropdown">
            <label>Sorting: </label>
            <select onChange={handleSortingChange} value={sortingOption}>
              <option>Priority</option>
              <option>Title</option>
            </select>
          </div>
        </div>
      </header>
      <main className="App-main">

        <div className="Sectioncontainer">
          {Object.keys(sortedTickets).map(group => (
            <section key={group} className="Section">
              <p>{group} {getGroupCardCount(group)}</p>
              <div className="CardContainer">
                {sortedTickets[group].map(ticket => (
                  <div key={ticket.id} className="Card">
                    <p>{ticket.id}</p>
                    <h4>{ticket.title}</h4>
                    {/* <p>Status: {ticket.status}</p>
                    <p>Priority: {ticket.priority}</p> */}
                    <div className='content'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6B6F76" class="w-6 h-6" height="18px" width="18px">
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                    </svg>

                    <p>{ticket.tag}</p>
                    </div>
                    {/* <p>User: {getUsername(ticket.userId)}</p>
                    <p>Available: {getUserAvailability(ticket.userId)}</p> */}
                    <p></p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
