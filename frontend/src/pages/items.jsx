import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

function Items() {
  const { itemId } = useParams(); 
  const ITEM_URL=`http://localhost:3000/items`;
  let navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get('token');
  const uid = cookies.get('userId');
  const [item, setItemDetails] = useState(null);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: ITEM_URL,
      headers: {
        'Content-Type': 'application/json',
        'item': itemId,
        'userId': uid,
        'token': token,
      },
    };
    axios(configuration)
      .then((response) => {
        setItemDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        navigate('/search');
      });
  }, [itemId]);

  const addtoCart = () => {
    const configuration = {
      method: "post",
      url: ITEM_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': uid,
        'item': itemId,
        'token': token,
      },
    };
    axios(configuration)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  return (
    <div>
      {item ? (
        <div>
          <h1>{item.item.name}</h1>
          <p><strong>Price:</strong> ${item.item.price}</p>
          <p><strong>Description:</strong> {item.item.description}</p>
          <p><strong>Seller:</strong> {item.seller.fname} {item.seller.lname}</p>
          <button onClick={addtoCart}>Add to Cart</button>
        </div>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
}

export default Items;
