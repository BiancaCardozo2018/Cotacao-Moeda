import './App.css';
import Conversor from './components/Conversor';

function App() {
  return (
    <div className="App">
      <Conversor moedaA="USD" moedaB="BRL"></Conversor>
    </div>
  );
}

export default App;
