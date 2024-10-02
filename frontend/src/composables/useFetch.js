import { useContext, useEffect } from "react";
import axios from "axios";

import { CommonContext } from "../contexts/CommonContext";

export const useFetch = (url, tokenData) => {
  const { setNotesData, setMsg, confirmDelete } = useContext(CommonContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let savedNoteData = await axios.get(url, {
          headers: {
            Authorization: tokenData,
          },
        });

        console.log("response from db", savedNoteData);
        const resData = savedNoteData.data.data;

        if (resData.length > 0) {
          setNotesData(resData);
          setMsg("");
        }
      } catch (err) {
        console.log(err.response.data.message);
        setMsg(err.response.data.message);
      }
    };

    fetchData();
  }, [url, tokenData, setNotesData, setMsg, confirmDelete]);
};