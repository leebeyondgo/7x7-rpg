class Monster {
  constructor(row, col, hp = 1) {
    this.row = row;
    this.col = col;
    this.hp = hp;
  }

  move(dRow, dCol) {
    this.row += dRow;
    this.col += dCol;
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  isDead() {
    return this.hp <= 0;
  }
}

export default Monster;
