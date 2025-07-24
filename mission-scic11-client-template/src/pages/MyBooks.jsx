import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function MyBooks() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  console.log("🚀 ~ MyBooks ~ books:", books);

  useEffect(() => {
    axios
      .get("http://localhost:5000/my-books", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => setBooks(res.data));
  }, [user]);

  return <div>MyBooks</div>;
}
