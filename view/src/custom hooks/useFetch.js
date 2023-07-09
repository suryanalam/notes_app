import { useContext, useEffect } from "react";
import axios from "axios";
import { ToggleContext } from "../contexts/ToggleContext";



export const useFetch = (url, tokenData) => {
  const { setNotesData, setMsg } = useContext(ToggleContext);

  useEffect(() => {

    const fetchData = async () =>{
      await axios.get(url, {
        headers: {
          Authorization: tokenData,
        },
      })
        .then((res) => {
            setNotesData(res.data.data);
            setMsg('');
            console.log('res from fetch.js: ',res.data.data);
        })
        .catch((err) => {
            console.log(err.response.data.message);
            setMsg(err.response.data.message)
        });
    }

    fetchData();

  },[url, tokenData, setNotesData, setMsg]);

};