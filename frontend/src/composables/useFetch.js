import { useEffect, useState } from "react";
import axios from "axios";

export const useFetch = (url, token) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });

        if (!resp) {
          throw new Error("Response not found !!");
        }

        setData(resp?.data?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [url, token]);

  return { data, error, loading };
};
