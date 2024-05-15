

async function performSearch() {
  let top5Lists = {
    artists: [],
    songs: [],
    albums: []
  };
  const query = document.getElementById('searchInput').value;
  const type = document.getElementById('searchType').value;
  if (!query) return;

  let searchQuery = query;
  let artistName = '';

  if (type === 'track') {
    const byIndex = query.toLowerCase().indexOf(' by ');
    if (byIndex !== -1) {
      searchQuery = query.slice(0, byIndex).trim();
      artistName = query.slice(byIndex + 4).trim();
    }
  }

  const response = await fetch(`/search?q=${searchQuery}&type=${type}&artist=${artistName}`);
  const data = await response.json();

  displaySearchResults(data, type);
}

function displaySearchResults(data, type) {
  const resultsList = document.getElementById('searchResults');
  resultsList.innerHTML = '';

  let items = [];
  if (type === 'artist') {
    items = data.artists.items;
  } else if (type === 'track') {
    items = data.tracks.items;
  } else if (type === 'album') {
    items = data.albums.items;
  }

  items.forEach(item => {
    const listItem = document.createElement('li');
    if (type === 'track') {
      listItem.textContent = `${item.name} by ${item.artists[0].name}`;
    } else if (type === 'album') {
      listItem.textContent = `${item.name} by ${item.artists[0].name}`;
    } else {
      listItem.textContent = item.name;
    }
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.className = 'add-button';
    addButton.onclick = () => addToTop5(item, type);
    listItem.appendChild(addButton);
    resultsList.appendChild(listItem);
  });
}

function displayTop5Lists() {
  displayResults(top5Lists.artists, 'artistsList', 'name');
  displayResults(top5Lists.songs, 'songsList', 'name', 'track');
  displayResults(top5Lists.albums, 'albumsList', 'name', 'album');
}

function displayResults(items, elementId, key, type) {
  const list = document.getElementById(elementId);
  list.innerHTML = '';
  items.forEach(item => {
    const listItem = document.createElement('li');
    if (type === 'track') {
      listItem.textContent = `${item[key]} by ${item.artists[0].name}`;
    } else if (type === 'album') {
      listItem.textContent = `${item[key]} by ${item.artists[0].name}`;
    } else {
      listItem.textContent = item[key];
    }
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'add-button';
    removeButton.onclick = () => removeFromTop5(item, elementId);
    listItem.appendChild(removeButton);
    list.appendChild(listItem);
  });
}

async function addToTop5(item, type) {
  const listType = type === 'artist' ? 'artists' : type === 'track' ? 'songs' : 'albums';
  if (top5Lists[listType].length >= 5) {
    alert(`Top 5 ${listType} list is full. Please remove an item before adding another.`);
    return;
  }
  top5Lists[listType].push(item);
  await saveTop5Lists();
  displayTop5Lists();
}

function removeFromTop5(item, elementId) {
  const listType = elementId === 'artistsList' ? 'artists' : elementId === 'songsList' ? 'songs' : 'albums';
  top5Lists[listType] = top5Lists[listType].filter(i => i.id !== item.id);
  saveTop5Lists();
  displayTop5Lists();
}

async function saveTop5Lists() {
  const response = await fetch('/top5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(top5Lists)
  });
  const data = await response.json();
  console.log(data.message);
}

async function loadTop5() {
  const response = await fetch('/top5');
  const data = await response.json();
  top5Lists = data;
  displayTop5Lists();
}
  
  window.onload = () => {
    loadTop5();
  };
  