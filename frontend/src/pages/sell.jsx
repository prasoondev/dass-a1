import { useState } from "react"
import axios from "axios";
import Cookies from 'universal-cookie';

function Sell() {
    const SELL_URL = 'http://localhost:3000/sell';
    const cookies = new Cookies();
    const uid = cookies.get('userId');
    const token = cookies.get('token');
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const configuration = {
        method: "post",
        url: SELL_URL,
        data: {
          name,
          price: Number(price),
          description,
          sellerid: uid,
          category: ["testitem"],
        },
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(configuration);
        axios(configuration)
          .then((result) => {
            console.log(result);
            window.location.href = "/profile";
          })
          .catch((error) => {
            error = new Error();
            console.log(error);
          });
      }
    return (
      <div>
        <h1>Sell</h1>
        <form action="POST">
        <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" name="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" name="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="submit" value="Post" onClick={(e) => handleSubmit(e)} />
      </form>
      </div>
    )
  }
  
  export default Sell