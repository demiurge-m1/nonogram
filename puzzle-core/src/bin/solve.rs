use std::env;
use std::fs;
use std::process;

use puzzle_core::{solve, CellState, Puzzle};

fn main() {
    if let Err(err) = run() {
        eprintln!("error: {err}");
        process::exit(1);
    }
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let path = env::args()
        .nth(1)
        .ok_or("Usage: cargo run --bin solve <puzzle.json>")?;

    let contents = fs::read_to_string(&path)?;
    let puzzle: Puzzle = serde_json::from_str(&contents)?;

    match solve(&puzzle) {
        Some(grid) => {
            println!("Solved '{}':", puzzle.name);
            for row in 0..grid.size() {
                let mut line = String::with_capacity(grid.size());
                for col in 0..grid.size() {
                    let ch = match grid.get(row, col) {
                        CellState::Filled => '#',
                        CellState::Empty => '.',
                        CellState::Unknown => '?',
                    };
                    line.push(ch);
                }
                println!("{line}");
            }
        }
        None => {
            println!("Puzzle '{}' invalid or unsolvable", puzzle.name);
        }
    }

    Ok(())
}
