import {Link} from 'react-router-dom'
import Logout from '../pages/logout'
function Navbar(){
    return (
        <>
        <Link to="/search">
            <button>Search</button>
        </Link>
        <Link to="/profile">
            <button>Profile</button>
        </Link>
        <Link to="/support">
            <button>Support</button>
        </Link>
        <Link to="/cart">
            <button>Cart</button>
        </Link>
        <Link to="/deliver">
            <button>Deliver</button>
        </Link>
        <Link to="/orders">
            <button>Orders</button>
        </Link>
        <Link to="/sell">
            <button>Sell</button>
        </Link>
        <Link to="/buy">
            <button>My Items</button>
        </Link>
        <Link>
            <Logout />
        </Link>
        </>
    )
}

export default Navbar