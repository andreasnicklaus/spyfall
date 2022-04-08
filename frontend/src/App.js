import {
    Routes,
    Route,
    Link,
} from "react-router-dom";

import {Home} from "./views/home";
import {WaitingRoom} from "./views/waitingRoom";

function App() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/wait">Waiting Room</Link>
                    </li>
                    <li>
                        <Link to={"/users"}>Users</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" exact element={<Home/>}/>
                <Route path="/users" exact element={<Users/>}/>
                <Route path="/wait" exact element={<WaitingRoom/>}/>
            </Routes>
        </div>
    );
}

function Users() {
    return <h2>Users</h2>;
}

export default App;
