import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/favicon.svg";
import Select from "react-select";
import "./App.css";

function App() {
  const [selected, setSelected] = useState<{
    value: number;
    label: number;
  } | null>(null);

  const [targetBrethren, setTargetBrethren] = useState([
    { name: "Christian", target: "???" },
    { name: "Peter", target: "???" },
    { name: "Greg", target: "???" },
    { name: "Stephen", target: "???" },
  ]);

  useEffect(() => {
    if (selected) {
      // Create initial rotation where everyone gets the next person
      const newTargets = targetBrethren.map(
        (_, i) => targetBrethren[(i + 1) % targetBrethren.length].name
      );

      // Rotate the targets based on the year
      const rotations = selected.value % (targetBrethren.length - 1);
      for (let i = 0; i < rotations; i++) {
        newTargets.push(newTargets.shift()!);
      }

      // Update the targets
      setTargetBrethren(
        targetBrethren.map((brother, i) => ({
          ...brother,
          target: newTargets[i],
        }))
      );
    }
  }, [selected]);

  const options = [
    { value: 2020, label: 2020 },
    { value: 2021, label: 2021 },
    { value: 2022, label: 2022 },
    { value: 2023, label: 2023 },
    { value: 2024, label: 2024 },
    { value: 2025, label: 2025 },
    { value: 2026, label: 2026 },
    { value: 2027, label: 2027 },
    { value: 2028, label: 2028 },
    { value: 2029, label: 2029 },
    { value: 2030, label: 2030 },
    { value: 2031, label: 2031 },
  ];

  //const year = new Date().getFullYear();

  return (
    <>
      <div className="logo-container">
        <img src={viteLogo} className="logo" alt="Christmas tree" />
        <img src={reactLogo} className="logo react" alt="React logo" />
        <img src={viteLogo} className="logo" alt="Christmas tree" />
      </div>
      <h1>Christmas Gift Exchange</h1>
      <Select
        options={options}
        onChange={setSelected}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "#1A1A1A",
          }),
          option: (styles) => ({
            ...styles,
            backgroundColor: "#1A1A1A",
          }),
          singleValue: (styles) => ({
            ...styles,
            color: "#F9F9F9",
          }),
        }}
      />
      <div className="card">
        <p>Who has who for Christmas?? Select a year to find out!</p>
        <div className="assignments-container">
          {targetBrethren.map((brother, i) => (
            <div key={i} className="assignment-row">
              <span className="giver">{brother.name}</span>
              <span className="arrow">→</span>
              <span className="receiver">{brother.target}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
