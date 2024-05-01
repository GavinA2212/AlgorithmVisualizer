import { PRIMARY_COLOR, SECONDARY_COLOR, SORTED_COLOR } from "../components/SortingVisualizer/SortingVisualizer";
import { Animation } from "../interfaces/Animation";

export function getInsertionSortAnimation(array: number[]): Animation[] {
    const animations: Animation[] = [];
    insertionSortHelper(array, animations);
    return animations;
}

function insertionSortHelper(array: number[], animations: Animation[]) {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        animations.push({ num1: i, num2: i, color: SECONDARY_COLOR });

        while (j >= 0 && array[j] > key) {
            animations.push({ num1: j, num2: j, color: SECONDARY_COLOR });
            animations.push({ num1: j + 1, num2: array[j] });
            array[j + 1] = array[j];
            animations.push({ num1: j, num2: j, color: PRIMARY_COLOR });

            j = j - 1;
        }
        animations.push({ num1: j + 1, num2: key });
        array[j + 1] = key;
        animations.push({ num1: i, num2: i, color: PRIMARY_COLOR });

    }
}
