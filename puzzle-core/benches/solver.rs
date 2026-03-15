use criterion::{criterion_group, criterion_main, Criterion};
use puzzle_core::{solve, Puzzle};

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

fn benchmark_solver(c: &mut Criterion) {
    let puzzle = sample_puzzle();
    c.bench_function("solve_smiley", |b| {
        b.iter(|| {
            let _ = solve(&puzzle);
        })
    });
}

criterion_group!(benches, benchmark_solver);
criterion_main!(benches);
