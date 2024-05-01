import { PRIMARY_COLOR, SECONDARY_COLOR, SORTED_COLOR } from "../components/SortingVisualizer/SortingVisualizer";
import { Animation } from "../interfaces/Animation";

export function getBubbleSortAnimations(array: number[]): Animation[] {
    const animations: Animation[] = [];
    bubbleSortHelper(array, animations);
    return animations;
}

function bubbleSortHelper(array: number[], animations: Animation[]) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 1; j < array.length - i; j++) {
            animations.push({ num1: j - 1, num2: j, color: SECONDARY_COLOR });
            animations.push({ num1: j - 1, num2: j, color: PRIMARY_COLOR });

            if (array[j - 1] > array[j]) {
                const temp = array[j - 1];
                animations.push({ num1: j - 1, num2: array[j] });
                animations.push({ num1: j, num2: temp })
                array[j - 1] = array[j];
                array[j] = temp;
            }
        }
        animations.push({ num1: array.length - i - 1, num2: array.length - i - 1, color: SORTED_COLOR });
    }
}
