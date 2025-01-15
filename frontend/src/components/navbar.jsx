import {Link} from 'react-router-dom'
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
        </>
    )
}

export default Navbar