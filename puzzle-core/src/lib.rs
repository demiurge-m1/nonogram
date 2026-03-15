use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Puzzle {
    pub name: String,
    pub size: usize,
    pub rows: Vec<Vec<u8>>,
    pub cols: Vec<Vec<u8>>,
    pub solution: Vec<Vec<u8>>, // 1 = заполнено, 0 = пусто
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CellState {
    Unknown,
    Filled,
    Empty,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Grid {
    size: usize,
    cells: Vec<CellState>,
}

impl Grid {
    pub fn new(size: usize) -> Self {
        Self {
            size,
            cells: vec![CellState::Unknown; size * size],
        }
    }

    pub fn size(&self) -> usize {
        self.size
    }

    pub fn get(&self, row: usize, col: usize) -> CellState {
        self.cells[row * self.size + col]
    }

    pub fn set(&mut self, row: usize, col: usize, value: CellState) {
        self.cells[row * self.size + col] = value;
    }
}

pub fn validate_puzzle(puzzle: &Puzzle) -> bool {
    let expected = puzzle.size;
    let row_valid = puzzle
        .rows
        .iter()
        .all(|line| line.iter().all(|&value| value > 0) && !line.is_empty());
    let col_valid = puzzle
        .cols
        .iter()
        .all(|line| line.iter().all(|&value| value > 0) && !line.is_empty());

    let solution_valid = puzzle.solution.len() == expected
        && puzzle
            .solution
            .iter()
            .all(|row| row.len() == expected && row.iter().all(|&cell| cell <= 1));

    row_valid && col_valid && solution_valid
}

fn compute_clues(line: &[u8]) -> Vec<u8> {
    let mut clues = Vec::new();
    let mut count = 0;
    for &value in line {
        if value == 1 {
            count += 1;
        } else if count > 0 {
            clues.push(count);
            count = 0;
        }
    }
    if count > 0 {
        clues.push(count);
    }
    if clues.is_empty() {
        clues.push(0);
    }
    clues
}

fn columns_match(grid: &[Vec<u8>], expected: &[Vec<u8>]) -> bool {
    let size = grid.len();
    for col in 0..size {
        let column: Vec<u8> = grid.iter().map(|row| row[col]).collect();
        if compute_clues(&column) != expected[col] {
            return false;
        }
    }
    true
}

fn generate_row_patterns(clues: &[u8], size: usize) -> Vec<Vec<u8>> {
    if clues.is_empty() {
        return vec![vec![0; size]];
    }

    let total_filled: usize = clues.iter().map(|&c| c as usize).sum();
    if total_filled > size {
        return vec![];
    }

    let mut results = Vec::new();

    fn helper(
        idx: usize,
        pos: usize,
        clues: &[u8],
        size: usize,
        current: Vec<u8>,
        results: &mut Vec<Vec<u8>>,
    ) {
        if idx == clues.len() {
            let mut final_row = current;
            for i in pos..size {
                final_row[i] = 0;
            }
            results.push(final_row);
            return;
        }

        let block_len = clues[idx] as usize;
        let remaining_len: usize = clues[idx + 1..].iter().map(|&c| c as usize).sum();
        let remaining_spaces = clues.len().saturating_sub(idx + 1);
        if block_len == 0 || pos + block_len + remaining_len + remaining_spaces > size {
            return;
        }

        let max_start = size - (block_len + remaining_len + remaining_spaces);

        for start in pos..=max_start {
            let mut next_row = current.clone();
            for i in pos..start {
                next_row[i] = 0;
            }
            for i in start..start + block_len {
                next_row[i] = 1;
            }
            let next_pos = if idx + 1 == clues.len() {
                start + block_len
            } else {
                if start + block_len >= size {
                    break;
                }
                next_row[start + block_len] = 0;
                start + block_len + 1
            };
            helper(idx + 1, next_pos, clues, size, next_row, results);
        }
    }

    helper(0, 0, clues, size, vec![0; size], &mut results);
    results
}

fn solve_rows(
    puzzle: &Puzzle,
    row_index: usize,
    current: &mut Vec<Vec<u8>>,
) -> Option<Vec<Vec<u8>>> {
    if row_index == puzzle.size {
        if columns_match(current, &puzzle.cols) {
            return Some(current.clone());
        }
        return None;
    }

    for pattern in generate_row_patterns(&puzzle.rows[row_index], puzzle.size) {
        current[row_index] = pattern;
        if let Some(solution) = solve_rows(puzzle, row_index + 1, current) {
            return Some(solution);
        }
    }

    None
}

pub fn solve(puzzle: &Puzzle) -> Option<Grid> {
    if !validate_puzzle(puzzle) {
        return None;
    }
    let mut workspace = vec![vec![0; puzzle.size]; puzzle.size];
    let grid = solve_rows(puzzle, 0, &mut workspace)?;

    let mut solved = Grid::new(puzzle.size);
    for row in 0..puzzle.size {
        for col in 0..puzzle.size {
            let state = if grid[row][col] == 1 {
                CellState::Filled
            } else {
                CellState::Empty
            };
            solved.set(row, col, state);
        }
    }
    Some(solved)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_puzzle() -> Puzzle {
        Puzzle {
            name: "Smiley".into(),
            size: 5,
            rows: vec![vec![3], vec![1, 1], vec![3], vec![1, 1], vec![1, 1]],
            cols: vec![vec![1], vec![4], vec![1, 1], vec![4], vec![1]],
            solution: vec![
                vec![0, 1, 1, 1, 0],
                vec![0, 1, 0, 1, 0],
                vec![0, 1, 1, 1, 0],
                vec![0, 1, 0, 1, 0],
                vec![1, 0, 0, 0, 1],
            ],
        }
    }

    #[test]
    fn grid_read_write() {
        let mut grid = Grid::new(5);
        assert_eq!(grid.get(0, 0), CellState::Unknown);
        grid.set(0, 0, CellState::Filled);
        assert_eq!(grid.get(0, 0), CellState::Filled);
        grid.set(2, 3, CellState::Empty);
        assert_eq!(grid.get(2, 3), CellState::Empty);
    }

    #[test]
    fn puzzle_validation() {
        let puzzle = sample_puzzle();
        assert!(validate_puzzle(&puzzle));
    }

    #[test]
    fn puzzle_validation_fails_on_wrong_size() {
        let mut puzzle = sample_puzzle();
        puzzle.solution[0].push(1);
        assert!(!validate_puzzle(&puzzle));
    }

    #[test]
    fn solver_finds_solution() {
        let puzzle = sample_puzzle();
        let solved = solve(&puzzle).expect("should solve");
        for row in 0..puzzle.size {
            for col in 0..puzzle.size {
                let expected = if puzzle.solution[row][col] == 1 {
                    CellState::Filled
                } else {
                    CellState::Empty
                };
                assert_eq!(solved.get(row, col), expected);
            }
        }
    }

    #[test]
    fn row_patterns_cover_single_and_double_blocks() {
        let single = generate_row_patterns(&[3], 5);
        assert!(single.iter().any(|row| row == &vec![0, 1, 1, 1, 0]));
        let double = generate_row_patterns(&[1, 1], 5);
        assert!(double.iter().any(|row| row == &vec![0, 1, 0, 1, 0]));
    }

    #[test]
    fn solver_returns_none_on_invalid_puzzle() {
        let mut puzzle = sample_puzzle();
        puzzle.rows[0] = vec![5, 5]; // некорректно
        assert!(solve(&puzzle).is_none());
    }
}

#[cfg(feature = "wasm")]
pub mod wasm_api {
    use super::{solve, CellState, Puzzle};
    use serde::Serialize;
    use serde_wasm_bindgen::{from_value, to_value};
    use wasm_bindgen::prelude::*;

    #[derive(Serialize)]
    struct SolveResponse {
        size: usize,
        grid: Vec<Vec<u8>>,
    }

    #[wasm_bindgen]
    pub fn solve_json(value: JsValue) -> Result<JsValue, JsValue> {
        let puzzle: Puzzle =
            from_value(value).map_err(|err| JsValue::from_str(&err.to_string()))?;
        let solved = solve(&puzzle).ok_or_else(|| JsValue::from_str("Unsolvable"))?;
        let mut grid = Vec::with_capacity(solved.size());
        for row in 0..solved.size() {
            let mut line = Vec::with_capacity(solved.size());
            for col in 0..solved.size() {
                let value = match solved.get(row, col) {
                    CellState::Filled => 1,
                    CellState::Empty | CellState::Unknown => 0,
                };
                line.push(value);
            }
            grid.push(line);
        }
        let response = SolveResponse {
            size: solved.size(),
            grid,
        };
        to_value(&response).map_err(|err| JsValue::from_str(&err.to_string()))
    }
}
