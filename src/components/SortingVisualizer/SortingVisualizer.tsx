import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./SortingVisualizer.css";
import { getMergeSortAnimations } from "../../algorithms/MergeSort";
import { getBubbleSortAnimations } from "../../algorithms/BubbleSort";
import { getSelectionSortAnimations } from "../../algorithms/SelectionSort";
import { Algorithm } from "../../algorithms";
import { getInsertionSortAnimation } from "../../algorithms/InsertionSort";
import { Animation } from "../../interfaces/Animation";

const ANIMATION_SPEED_MS = 10;

export const PRIMARY_COLOR = "#bd93f9";

export const SECONDARY_COLOR = "#ff5555";

export const SORTED_COLOR = "#50fa7b";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [numberBars, setNumberBars] = useState<number>(60);
  const [speed, setSpeed] = useState<number>(ANIMATION_SPEED_MS);
  const [sorted, setSorted] = useState<boolean>(true);
  const [runtime, setRuntime] = useState<number>(0);
  let promises: Promise<unknown>[] = [];
  let timers: any = [];

  useEffect(() => {
    resetArray();
  }, [numberBars, speed]);

  function resetArray() {
    setSorted(true);
    const arr = [];
    const arrayBars = document.getElementsByClassName(
      "array-bar"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < arrayBars.length; i++) {
      const element = arrayBars[i];
      element.classList.remove("bar-visited");
      element.style.backgroundColor = PRIMARY_COLOR;
    }
    for (let i = 0; i < numberBars; i++) {
      arr.push(randomIntFromInterval(5, window.innerHeight / 2));
    }
    setArray(arr);
  }

  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function isSorted() {
    let flag: boolean = true;

    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  function sortHelper(type: Algorithm) {
    let animations: Animation[];
    switch (type) {
      case Algorithm.BUBBLE_SORT:
        animations = getBubbleSortAnimations(array);
        break;
      case Algorithm.MERGE_SORT:
        animations = getMergeSortAnimations(array);
        break;
      case Algorithm.SELECTION_SORT:
        animations = getSelectionSortAnimations(array);
        break;
      case Algorithm.INSERTION_SORT:
        animations = getInsertionSortAnimation(array);
        break;
      default:
        animations = getBubbleSortAnimations(array);
    }
    const arrayBars = document.getElementsByClassName(
      "array-bar"
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < animations.length; i++) {
      let animation = animations[i];
      const isColorChange = animation.color !== undefined;
      if (isColorChange) {
        const barOneStyle = arrayBars[animation.num1].style;
        const barTwoStyle = arrayBars[animation.num2].style;
        const promise = new Promise((resolve, reject) =>
          timers.push(
            setTimeout(() => {
              barOneStyle.backgroundColor = animation.color
                ? animation.color
                : "";
              barTwoStyle.backgroundColor = animation.color
                ? animation.color
                : "";
              resolve(true);
            }, i * speed)
          )
        );
        promises.push(promise);
      } else {
        const id = new Promise((resolve, rejeect) =>
          timers.push(
            setTimeout(() => {
              const barOneStyle = arrayBars[animation.num1].style;
              barOneStyle.height = `${animation.num2}px`;
              resolve(true);
            }, i * speed)
          )
        );
        promises.push(id);
      }
    }
    return Promise.all(promises);
  }

  async function sort(algortihm: Algorithm) {
    setSorted(false);

    await sortHelper(algortihm);
    const arrayBars = document.getElementsByClassName(
      "array-bar"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < arrayBars.length; i++) {
      let element = arrayBars[i];
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          element.classList.add("bar-visited");
          resolve(true);
        }, i * 10);
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    setSorted(true);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.id === "changeSize") {
      setNumberBars(parseInt(event.target.value) * 5);
    }
  }

  return (
    <div className="container">
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}
          ></div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <input
          type="range"
          min="5"
          max="50"
          id="changeSize"
          style={{ background: "white", cursor: "pointer" }}
          title="asd"
          onChange={handleChange}
          value={numberBars / 5}
          disabled={!sorted}
        ></input>
        <br />
        <span>Number of bars</span>
      </div>

      <div id="buttons">
        <button onClick={() => resetArray()} disabled={!sorted}>
          Generate New Array
        </button>
        <button onClick={() => sort(Algorithm.MERGE_SORT)} disabled={!sorted}>
          Merge Sort
        </button>
        <button onClick={() => sort(Algorithm.BUBBLE_SORT)} disabled={!sorted}>
          Bubble Sort
        </button>
        <button
          onClick={() => sort(Algorithm.SELECTION_SORT)}
          disabled={!sorted}
        >
          Selection Sort
        </button>
        <button
          onClick={() => sort(Algorithm.INSERTION_SORT)}
          disabled={!sorted}
        >
          Insertion Sort
        </button>
      </div>

      <div>
        <p>In Progress: {sorted ? "No" : "Yes"}</p>
        <p>Total Bars: {numberBars}</p>
      </div>
    </div>
  );
}
