import devResources from './devResources.json';
import './App.css';
function App() {
  console.log(devResources);
  return (
    <div>
      <header>
        <h1>Developer Resources</h1>

        <div>
          <form>
            <input type="text" placeholder="Search" />
            <button>Search</button>
          </form>
        </div>

        <div>
          <select>
            <option value="all">All</option>
            <option value="learning">Learning</option>
            <option value="tools">Tools</option>
            <option value="frameworks">Frameworks</option>
            <option value="databases">Databases</option>
            <option value="testing">Testing</option>
            <option value="other">Other</option>
          </select>
        </div>
      </header>

      <main>
        {Object.keys(devResources).map((category) => (
          <div key={category}>
            <h2>{category}</h2>
            <div>
              {devResources[category].map((item) => (
                <div key={item.id}>
                  <div>
                    <img src={item.icon} alt="Resource Icon" />
                  </div>
                  <div>
                    <p>{item.descrittion}</p>
                  </div>
                  <div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer>
        <div>
          <a href="https://www.linkedin.com/in/your-profile">LinkedIn</a>
          <a href="https://www.github.com/your-profile">GitHub</a>
          <a href="https://www.twitter.com/your-profile">Twitter</a>
        </div>
        <p>Copyright 2026 Developer Resources</p>
      </footer>
    </div>
  );
}

export default App;
