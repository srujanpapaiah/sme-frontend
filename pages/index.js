import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spreadsheet } from "react-spreadsheet";
import Card from "../component/Card";
import Link from "next/link";

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(null); // New error state

  const backendBaseURL = "https://gold-bright-trout.cyclic.app";

  const getData = async () => {
    setLoading(true); // Set loading to true while fetching data
    setError(null); // Reset error state

    try {
      const response = await fetch(
        backendBaseURL + "/getAll/" + name + "?date=" + startDate,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const result = await response.json();

      setTableData(
        result?.map((item) => {
          return Object.values(item).map((d, i) => {
            if (dayjs(d).isValid()) {
              return {
                value: dayjs(d).format("DD/MM/YYYY"),
              };
            }
            return { value: d };
          });
        })
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [name, startDate]);

  return (
    <div>
      <div className="top-container">
        <select
          style={{ padding: 10 }}
          onChange={(e) => setName(e.target.value)}
        >
          <option value="">Select SME</option>
          <option value="Aman Kumar">Aman Kumar</option>
          <option value="Yashraj">Yashraj</option>
          <option value="Sanjay">Sanjay</option>
          <option value="Nithya Arul">Nithya Arul</option>{" "}
        </select>

        <div style={{ display: "flex" }}>
          <button
            onClick={() => {
              setStartDate(dayjs(startDate).subtract(1, "day").toDate());
            }}
          >
            &lt;
          </button>
          <DatePicker
            dateFormat={"dd/MM/yyyy"}
            selected={startDate}
            onChange={(date) => {
              console.log(date);
              setStartDate(date);
            }}
          />
          <button
            onClick={() => {
              setStartDate(dayjs(startDate).add(1, "day").toDate());
            }}
          >
            &gt;
          </button>{" "}
        </div>
        <div>
          <button onClick={getData}>Refetch</button>
          <button>
            <Link href="/detail">Detail</Link>
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}{" "}
      {!loading && !error && !name && <RenderAnalytics tableData={tableData} />}
      <div className="sheet">
        <Spreadsheet darkMode data={tableData} />
      </div>
    </div>
  );
}

export function RenderAnalytics({ tableData }) {
  const smeNames = ["Aman Kumar", "Yashraj", "Sanjay", "Nithya Arul"];

  function countRowsForName(name) {
    let count = 0;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i][5]?.value === name) {
        count++;
      }
    }
    return {
      name,
      count,
    };
  }

  const result = smeNames.map((name) => countRowsForName(name));

  const maxCountObj = result.reduce((max, obj) => {
    return obj.count > max.count ? obj : max;
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "20px",
      }}
    >
      {result?.map((data) => (
        <Card key={data?.name} {...data} maxCountObj={maxCountObj} />
      ))}
    </div>
  );
}
