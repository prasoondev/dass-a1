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
    const [category, setCategory] = useState([]);
    const [checkboxes, setCheckboxes] = useState({
      electronics: false,
      consumeables: false,
      dailyuse: false,
      clothing: false,
      furniture: false,
      books: false,
      memberships: false,
    });

    const configuration = {
        method: "post",
        url: SELL_URL,
        data: {
          name,
          price: Number(price),
          description,
          sellerid: uid,
          category: category,
          userId: uid,
          token: token,
        },
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(category);
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

      const handleCheckboxChange = (categoryName) => {
        setCheckboxes((prev) => ({
          ...prev,
          [categoryName]: !prev[categoryName],
        }));
        setCategory((prev) =>
          checkboxes[categoryName]
            ? prev.filter((item) => item !== categoryName) // Remove category
            : [...prev, categoryName] // Add category
        );
      };

    return (
      <div>
        <h1>Sell</h1>
        <form action="POST">
        <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" name="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" name="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        {["electronics", "consumeables", "dailyuse", "clothing", "furniture", "books", "memberships"].map((cat) => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={checkboxes[cat]}
              onChange={() => handleCheckboxChange(cat)}
            />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </label>
        ))}
        <input type="submit" value="Post" onClick={(e) => handleSubmit(e)} />
      </form>
      </div>
    )
  }
  
  export default Sell