import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

function Search() {
  const SEARCH_URL = 'http://localhost:3000/search';
  const cookies = new Cookies();
  let navigate = useNavigate();
  const uid = cookies.get('userId');
  const [search, setSearch] = useState("");
  const [searchResults, setSearchresults] = useState(null);
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
  const configuration = {
    method: "get",
    url: SEARCH_URL,
    headers: {
      'id': uid,
      'search': search,
      'category': JSON.stringify(category),
    },
  };
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(category);
    axios(configuration)
      .then((response) => {
        setSearchresults(response.data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }
  const handleViewDetails = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  return (
    <div>
      <h1>Search</h1>
      {!(searchResults && searchResults.length > 0) ? (

        <form>
          <input type="text" name="fname" placeholder="Search items" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <input type="submit" value="Search" onClick={(e) => handleSearch(e)} />
        </form>
      ) : (
        <>
        <form>
              <input type="text" name="fname" placeholder="Search items" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <input type="submit" value="Search" onClick={(e) => handleSearch(e)} />
            </form>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {searchResults.map((item) => (
            <div
              key={item.itemId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                width: "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{item.name}</h3>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <button
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => handleViewDetails(item.itemId)}
              >
                View Details
              </button>
            </div>
        ))}
        </div>
        </>
      )}
    </div>
  )
}

export default Search