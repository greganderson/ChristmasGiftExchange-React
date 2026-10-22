import { useState, useMemo } from "react";
import dross from "./assets/dross.png";
import viteLogo from "/favicon.svg";
import Select from "react-select";
import "./App.css";
import ReactConfetti from "react-confetti";

const BRETHREN = ["Christian", "Peter", "Greg", "Stephen"];
const FIRST_YEAR = 2020;
const currentYear = new Date().getFullYear();

const yearOptions = Array.from(
  { length: currentYear + 5 - FIRST_YEAR + 1 },
  (_, i) => ({ value: FIRST_YEAR + i, label: FIRST_YEAR + i })
);

function App() {
  const [selected, setSelected] = useState(
    yearOptions.find((option) => option.value === currentYear) ?? null
  );

  const targetBrethren = useMemo(() => {
    if (!selected) {
      return BRETHREN.map((name) => ({ name, target: "???" }));
    }

    // Create initial rotation where everyone gets the next person
    const targets = BRETHREN.map((_, i) => BRETHREN[(i + 1) % BRETHREN.length]);

    // Rotate the targets based on the year
    const rotations = selected.value % (BRETHREN.length - 1);
    for (let i = 0; i < rotations; i++) {
      targets.push(targets.shift()!);
    }

    return BRETHREN.map((name, i) => ({ name, target: targets[i] }));
  }, [selected]);

  const [confettiBursts, setConfettiBursts] = useState<
    {
      id: number;
      width: number;
      height: number;
      source: { x: number; y: number; w: number; h: number };
    }[]
  >([]);

  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConfettiBursts((bursts) => [
      ...bursts,
      {
        id: Date.now() + Math.random(),
        // react-confetti otherwise sizes its canvas from the window size at
        // page load, which misplaces the burst if the screen size has changed
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        source: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: 0,
          h: 0,
        },
      },
    ]);
  };

  // react-select only scrolls the selected year to the edge of the menu,
  // so wait for it to render and then center it ourselves
  const centerSelectedYear = () => {
    requestAnimationFrame(() => {
      const menuList = document.querySelector<HTMLElement>(
        ".year-select__menu-list"
      );
      const option = menuList?.querySelector<HTMLElement>(
        ".year-select__option--is-selected"
      );
      if (!menuList || !option) return;
      menuList.scrollTop =
        option.offsetTop - (menuList.clientHeight - option.offsetHeight) / 2;
    });
  };

  const logos = [
    { src: viteLogo, className: "logo" },
    { src: dross, className: "logo dross" },
    { src: viteLogo, className: "logo" },
  ];

  return (
    <>
      {confettiBursts.map(({ id, width, height, source }) => (
        <ReactConfetti
          key={id}
          recycle={false}
          numberOfPieces={200}
          width={width}
          height={height}
          confettiSource={source}
          onConfettiComplete={() =>
            setConfettiBursts((bursts) => bursts.filter((b) => b.id !== id))
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      ))}
      <div className="logo-container">
        {logos.map((logo, i) => (
          <button
            key={i}
            type="button"
            className="logo-button"
            aria-label="Launch confetti"
            onClick={handleLogoClick}
          >
            <img src={logo.src} className={logo.className} alt="" />
          </button>
        ))}
      </div>
      <h1>Christmas Gift Exchange</h1>
      <Select
        options={yearOptions}
        value={selected}
        onChange={setSelected}
        isSearchable={false}
        aria-label="Year"
        classNamePrefix="year-select"
        onMenuOpen={centerSelectedYear}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "var(--surface)",
          }),
          menu: (styles) => ({
            ...styles,
            backgroundColor: "var(--surface)",
          }),
          option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isSelected
              ? "var(--selected)"
              : isFocused
                ? "var(--surface-hover)"
                : "var(--surface)",
            color: "var(--text-strong)",
            fontWeight: isSelected ? "bold" : "normal",
          }),
          singleValue: (styles) => ({
            ...styles,
            color: "var(--text-strong)",
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
